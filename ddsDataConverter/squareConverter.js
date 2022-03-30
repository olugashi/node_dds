function squareConverter(connector, data) {
  connector.output.instance.setNumber("x", data.x);
  connector.output.instance.setNumber("y", data.y);
  connector.output.instance.setNumber("shapesize", data.shapesize);
  connector.output.instance.setString("color", data.color);
  connector.output.write();
}

module.exports = { squareConverter };
