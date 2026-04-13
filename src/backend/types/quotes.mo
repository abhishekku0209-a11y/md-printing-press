module {
  public type QuoteStatus = {
    #New;
    #Contacted;
    #Won;
    #Lost;
  };

  public type Quote = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    serviceType : Text;
    projectDetails : Text;
    budgetRange : Text;
    timeline : Text;
    status : QuoteStatus;
    createdAt : Int;
  };

  public type CreateQuoteInput = {
    name : Text;
    email : Text;
    phone : Text;
    serviceType : Text;
    projectDetails : Text;
    budgetRange : Text;
    timeline : Text;
  };
};
