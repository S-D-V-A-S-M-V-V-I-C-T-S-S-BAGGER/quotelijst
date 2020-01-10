import * as React from "react";
import { NewQuoteProps } from "./NewQuote";

export interface QuoteProps extends NewQuoteProps {
  id: number;
}

export function Quote(props: QuoteProps) {
  return (
    <>
      <p className="quote-top">
        {props.date.toDateString()} - {props.name}:
      </p>
      <p className="quote-bottom">{props.text}</p>
    </>
  );
}
