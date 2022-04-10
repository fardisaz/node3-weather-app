const request = require("postman-request");
const forcast = (latitude, longtitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=888cb56b358e95c4f3f2ca319e6b33e7&query=${latitude},${longtitude}&units=f`;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to weather service!", undefined);
    } else if (body.error) {
      callback("Unable to find location", undefined);
    } else {
      callback(
        undefined,
        `${body.current.weather_descriptions[0]}. It is currently ${body.current.temperature} degrees out. It feels like ${body.current.feelslike} degrees out. There is a ${body.current.precip}% chance of rain. The humidity is ${body.current.humidity}%.`
      );
    }
  });
};

module.exports = forcast;
