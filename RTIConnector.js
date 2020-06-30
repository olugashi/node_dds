import sleep from "sleep";
import { Connector } from "rticonnextdds-connector";

class RTIConnector {
  constructor(socketsio, fullpath, participant) {
    this.socketsio = socketsio;
    this.outputs = [];
    this.inputs = [];
    this.connector = new Connector(participant, fullpath);

    this.connector.on("on_data_available", () => {
      // We have received data on one of the inputs within this connector
      // Iterate through each one, checking if it has any valid data
      this.inputs.forEach((element) => {
        element.input.take();
        for (const sample of element.input.samples.validDataIter) {
          console.log(sample.getJson());
          this.socketsio.emit(element.topic, sample.getJson());
        }
      });
    });
  }

  registerPublisher(output, topic, dataConverter) {
    this.outputs.push({
      output: this.connector.getOutput(output),
      topic: topic,
      dataConverter: dataConverter,
    });
  }
  registerSubscriber(input, topic) {
    this.inputs.push({
      input: this.connector.getInput(input),
      topic: topic,
    });
  }

  writeData(data, type) {
    const run = async () => {
      try {
        const connector = this.outputs.find(
          (element) => element.topic === type
        );
        connector.dataConverter(connector, data);

        // Wait for all subscriptions to receive the data before exiting
        await connector.output.wait();
      } catch (err) {
        console.log("Error encountered: " + err);
      }
      //connector.close()
    };
    run();
  }

  close() {
    this.connector.close();
  }
}
export default RTIConnector;
