import List "mo:core/List";
import Types "../types/quotes";

module {
  public func createQuote(
    quotes : List.List<Types.Quote>,
    nextId : Nat,
    input : Types.CreateQuoteInput,
    now : Int,
  ) : Types.Quote {
    let q : Types.Quote = {
      id = nextId;
      name = input.name;
      email = input.email;
      phone = input.phone;
      serviceType = input.serviceType;
      projectDetails = input.projectDetails;
      budgetRange = input.budgetRange;
      timeline = input.timeline;
      status = #New;
      createdAt = now;
    };
    quotes.add(q);
    q;
  };

  public func getAllQuotes(quotes : List.List<Types.Quote>) : [Types.Quote] {
    quotes.toArray();
  };

  public func getQuote(quotes : List.List<Types.Quote>, id : Nat) : ?Types.Quote {
    quotes.find(func(q) { q.id == id });
  };

  public func updateQuoteStatus(
    quotes : List.List<Types.Quote>,
    id : Nat,
    status : Types.QuoteStatus,
  ) : Bool {
    var found = false;
    quotes.mapInPlace(func(q) {
      if (q.id == id) {
        found := true;
        { q with status };
      } else { q };
    });
    found;
  };
};
