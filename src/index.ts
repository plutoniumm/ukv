// Browser stuff
import { generate_api } from "./cfbulk";;
import { generate_ns } from "./cfkv";;

const generate = (...something: any) => {
  if (something.length === 1 && something[0].get) {
    return generate_ns(something[0]);
  } else {
    return generate_api(...something as [string, string, string]);
  }
};

export { generate as CF };
export { ls as LS, ss as SS } from './browser';