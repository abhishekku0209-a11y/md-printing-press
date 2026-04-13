import List "mo:core/List";
import Time "mo:core/Time";
import QuoteTypes "../types/quotes";
import QuotesLib "../lib/quotes";

mixin (
  quotes : List.List<QuoteTypes.Quote>,
  nextQuoteId : { var value : Nat },
) {
  // Public: anyone can submit a quote request
  public shared func createQuote(input : QuoteTypes.CreateQuoteInput) : async QuoteTypes.Quote {
    let id = nextQuoteId.value;
    nextQuoteId.value += 1;
    QuotesLib.createQuote(quotes, id, input, Time.now());
  };

  // Admin endpoints — guarded by frontend session after verifyAdminCredentials
  public shared func getAllQuotes() : async [QuoteTypes.Quote] {
    QuotesLib.getAllQuotes(quotes);
  };

  public shared func getQuote(id : Nat) : async ?QuoteTypes.Quote {
    QuotesLib.getQuote(quotes, id);
  };

  public shared func updateQuoteStatus(
    id : Nat,
    status : QuoteTypes.QuoteStatus,
  ) : async Bool {
    QuotesLib.updateQuoteStatus(quotes, id, status);
  };
};
