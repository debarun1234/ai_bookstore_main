class ActionProvider {
    constructor(createChatBotMessage, setStateFunc) {
      this.createChatBotMessage = createChatBotMessage;
      this.setState = setStateFunc;
    }
  
    handleUser = () => {
      const message = this.createChatBotMessage("Great! Let's get started. Please provide your basic information.");
      this.addMessageToState(message);
    };
  
    handleSeller = () => {
      const message = this.createChatBotMessage("Welcome, Seller! Please provide your login credentials.");
      this.addMessageToState(message);
    };
  
    handleOrder = () => {
      const message = this.createChatBotMessage("Please provide your order ID to check the status.");
      this.addMessageToState(message);
    };
  
    handleWishlist = () => {
      const message = this.createChatBotMessage("Managing your wishlist...");
      this.addMessageToState(message);
    };
  
    handleComplaint = () => {
      const message = this.createChatBotMessage("Please describe your complaint.");
      this.addMessageToState(message);
    };
  
    handleSellerLogin = () => {
      const message = this.createChatBotMessage("Please provide your login credentials.");
      this.addMessageToState(message);
    };
  
    handleCatalog = () => {
      const message = this.createChatBotMessage("Showing the books catalogue...");
      this.addMessageToState(message);
    };
  
    handleShipment = () => {
      const message = this.createChatBotMessage("Managing your shipments...");
      this.addMessageToState(message);
    };
  
    handleAccount = () => {
      const message = this.createChatBotMessage("Showing your account details...");
      this.addMessageToState(message);
    };
  
    handleDashboard = () => {
      const message = this.createChatBotMessage("Showing your dashboard...");
      this.addMessageToState(message);
    };
  
    handleUnknown = () => {
      const message = this.createChatBotMessage("I'm not sure how to help with that.");
      this.addMessageToState(message);
    };
  
    addMessageToState = (message) => {
      this.setState(prevState => ({
        ...prevState,
        messages: [...prevState.messages, message]
      }));
    };
  }
  
  export default ActionProvider;
  