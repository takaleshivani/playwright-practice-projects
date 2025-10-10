import { randomValueFromArray } from "@helpers/arrays";
export function randomState(){
    const states = ["Maharashtra","Gujarat","Rajasthan","Punjab","Kerala"];
    return randomValueFromArray(states);
}