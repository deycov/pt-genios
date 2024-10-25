import { TextClassificationOutput } from "@huggingface/inference";
import { ReactNode } from "react";

export type SetterUseState = React.Dispatch<React.SetStateAction<string>>;

export type SetterNumber = React.Dispatch<React.SetStateAction<number[]>>;

export type SetterBoolean = React.Dispatch<React.SetStateAction<boolean>>;

export type Model = (text: string) => Promise<TextClassificationOutput | undefined>

export interface ChildrenProps {
  children: ReactNode
}

export interface FileCSV {
  id: string,
  text: string,
  likes: number,
  comments: number,
  shares: number,
  reactionsCount: number
}

export interface Emotions {
  label: string,
  score: number
}

export interface AnalizeCSV extends FileCSV {
  emotion: Emotions[], 
  sentiment: Emotions[] 
}

export type AnalizeDispatch = React.Dispatch<React.SetStateAction<AnalizeCSV[]>>