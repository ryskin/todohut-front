export const getIdealTextColor = (bgColor?: string) => {
  if (!bgColor) {
    return "text-white";
  }
  var nThreshold = 105;
  var components = getRGBComponents(bgColor);
  var bgDelta =
    components.R * 0.299 + components.G * 0.587 + components.B * 0.114;

  return 255 - bgDelta < nThreshold ? "text-black" : "text-white";
};

const getRGBComponents = (color: string) => {
  var r = color.substring(1, 3);
  var g = color.substring(3, 5);
  var b = color.substring(5, 7);

  return {
    R: parseInt(r, 16),
    G: parseInt(g, 16),
    B: parseInt(b, 16),
  };
};

//number to two digit string
export const toTwoDigitString = (num: number) => {
  // num round to natural number
  const roundedNum = Math.round(num);
  return roundedNum < 10 ? "0" + roundedNum : (roundedNum.toString());
};

export const randomId = () => String(Math.floor(Math.random() * 1000000));

// convert seconds to MM:HH:SS format not Date
export const secondsToHHMMSS = (sec: number) => {
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec - hours * 3600) / 60);
  const seconds = sec - hours * 3600 - minutes * 60;
  return `${toTwoDigitString(hours)}:${toTwoDigitString(
    minutes
  )}:${toTwoDigitString(seconds)}`;
};

const colors = ['#00AA55', '#009FD4', '#B381B3', '#939393', '#E3BC00', '#D47500', '#DC2A2A'];

export const numberFromText = (text: string) =>{
  // numberFromText("AA");
  const charCodes = text
    .split('') // => ["A", "A"]
    .map(char => char.charCodeAt(0)) // => [65, 65]
    .join(''); // => "6565"
  return parseInt(charCodes, 10);
}

export const colorsFromText = (text: string) => {
  return colors[numberFromText(text) % colors.length];
};
