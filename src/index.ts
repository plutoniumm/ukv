// Browser stuff
export {
  ls as LS,
  ss as SS
} from './browser';

import { generate_api } from "./cfbulk";;
import { generate_ns } from "./cfkv";;

export const generate = (...something: any) => {
  // check if KVNamespace
  if (something.length === 1 && something[0].get) {
    return generate_ns(something[0]);
  } else {
    return generate_api(...something as ([string, string, string]));
  }
};