import sleep from 'sleep'
import { Connector } from 'rticonnextdds-connector'
import { join } from 'path'
const fullpath = join(__dirname, './ShapeExample.xml')

class RTIConnector
{
    constructor(socketsio)
    {
        this.socketsio = socketsio
        this.connector = new Connector('MyParticipantLibrary::TransformationParticipant', fullpath)

     this.inputs = [
        { input: this.connector.getInput('MySubscriber::MySquareReader'), topic: 'square' },
        { input: this.connector.getInput('MySubscriber::MyTriangleReader'), topic: 'triangle' },
        { input: this.connector.getInput('MySubscriber::MyCircleReader'), topic: 'circle' }
      ]

      this.outputs =  [
        { output: this.connector.getOutput('MyPublisher::MyCircleWriter'), topic: 'circle' },
        { output: this.connector.getOutput('MyPublisher::MySquareWriter'), topic: 'square' },
        { output: this.connector.getOutput('MyPublisher::MyTriangleWriter'), topic: 'triangle' },
      ]

      this.connector.on('on_data_available', () => {
        // We have received data on one of the inputs within this connector
        // Iterate through each one, checking if it has any valid data
        this.inputs.forEach(element => {
          element.input.take()
          for (const sample of element.input.samples.validDataIter) {
            //console.log(sample.getJson())
            this.socketsio.emit(element.topic, sample.getJson())
          }
        })})
    }

    writeData(data, type)
    {
      const run =async () => {
       
        try {
         
          const connector =this.outputs.find((element) => element.topic === type)
          //console.log(connector.output)
          //const output = this.connector.getOutput('MyPublisher::MySquareWriter')
         
          connector.output.instance.setNumber('x', data.x)
          connector.output.instance.setNumber('y', data.y)
          connector.output.instance.setNumber('shapesize', data.shapesize)
          connector.output.instance.setString('color', data.color)
          connector.output.write()
          
          //console.log(connector.output.instance.getJson())
        
          // Wait for all subscriptions to receive the data before exiting
          await connector.output.wait()
        } catch (err) {
          console.log('Error encountered: ' + err)
        }
        //connector.close()
    }
    run()
  }
}
export default RTIConnector;