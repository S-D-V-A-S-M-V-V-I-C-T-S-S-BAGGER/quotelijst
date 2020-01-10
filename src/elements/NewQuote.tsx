import * as React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export interface NewQuoteProps {
  name: string;
  text: string;
  date: Date;
}

export interface NewQuoteElementProps extends NewQuoteProps {
  nameCallback: (name: string) => void;
  textCallback: (text: string) => void;
  dateCallback: (date: Date) => void;
}

export default function NewQuote(props: NewQuoteElementProps) {
  return (
    <>
      <input
        placeholder="Naam"
        defaultValue={props.name}
        onChange={event => props.nameCallback(event.target.value)}
      />
      <input
        placeholder="Quote"
        defaultValue={props.text}
        onChange={event => {
          props.textCallback(event.target.value);
        }}
      />
      <DatePicker
        selected={props.date}
        onChange={(date: Date | null) => {
          props.dateCallback(date!);
        }}
      />
    </>
  );
}
