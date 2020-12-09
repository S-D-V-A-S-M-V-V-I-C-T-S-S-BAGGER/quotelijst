import * as React from "react";
import { render } from "react-dom";
import Axios, { AxiosError } from "axios";
import { Quote, QuoteProps } from "./elements/Quote";
import "./styles.css";
import NewQuote from "./elements/NewQuote";
import { NewQuoteProps } from "./elements/NewQuote";

interface APIQuoteProps {
  id: number;
  wie: string;
  wanneer: string;
  wablief: string;
}

function getQuotes(
  quotes: APIQuoteProps[],
  setQuotes: React.Dispatch<React.SetStateAction<APIQuoteProps[]>>,
  enteredToken: string
) {
  if (quotes.length === 0 && enteredToken !== "") {
    Axios.get("/quotes")
      .then((result) => {
        setQuotes(result.data.quotes);
      })
      .catch((error) => {
        if (error.isAxiosError && error.response.status !== 401) {
          console.log(error);
        }
      });
  }
}

function App() {
  const [enteredToken, setToken] = React.useState<string>("");
  const [quotes, setQuotes] = React.useState<APIQuoteProps[]>([]);
  const [newQuote, setNewQuote] = React.useState<NewQuoteProps>({
    name: "",
    text: "",
    date: new Date()
  });

  Axios.defaults.baseURL =
    "https://v2-api.sheety.co/9723c08921460895c35d05d4d720d96f/baggerQuotelijst";
  Axios.defaults.headers.common["Authorization"] = `Bearer ${enteredToken}`;
  getQuotes(quotes, setQuotes, enteredToken);

  const quoteList = quotes
    .sort(
      (a, b) => new Date(b.wanneer).getTime() - new Date(a.wanneer).getTime()
    )
    .map(
      (quote, index): JSX.Element => {
        const newProps: QuoteProps = {
          id: quote.id,
          date: new Date(quote.wanneer),
          name: quote.wie,
          text: quote.wablief
        };
        return <Quote {...newProps} key={`QuoteItem-${index}`} />;
      }
    );

  return (
    <div className="App">
      <input
        placeholder="'huts voor de leden"
        defaultValue={enteredToken.toLowerCase()}
        onChange={(event) => {
          if (enteredToken !== event.target.value) {
            setToken(event.target.value.toLowerCase());
          }
        }}
      />
      <h1>BAGGER ZEGT VULGAIRE DINGEN</h1>
      <NewQuote
        {...newQuote}
        nameCallback={(newName: string) => {
          setNewQuote({ ...newQuote, name: newName });
        }}
        textCallback={(newText: string) => {
          setNewQuote({ ...newQuote, text: newText });
        }}
        dateCallback={(newDate: Date) => {
          setNewQuote({ ...newQuote, date: newDate });
        }}
      />
      <button
        onClick={() => {
          Axios.post("/quotes", {
            quote: {
              wie: newQuote.name,
              wanneer:
                newQuote.date.getMonth() +
                1 +
                "/" +
                newQuote.date.getDate() +
                "/" +
                newQuote.date.getFullYear(),
              wablief: newQuote.text
            }
          })
            .then(() => {
              setQuotes([]);
              setTimeout(() => {
                getQuotes(quotes, setQuotes, enteredToken);
              }, 500);
            })
            .catch((error) => {
              if (error.isAxiosError && error.response.status !== 401) {
                console.log(error);
              }
            });
        }}
      >
        Nieuwe quote toevoegen!
      </button>
      <h2>we kramen een hoop troep uit, zoals:</h2>
      {quoteList}
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
