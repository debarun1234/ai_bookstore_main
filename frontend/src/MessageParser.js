class MessageParser {
    constructor(actionProvider) {
      this.actionProvider = actionProvider;
    }
  
    parse(message) {
      const lowerCaseMessage = message.toLowerCase();
  
      if (lowerCaseMessage.includes("user")) {
        this.actionProvider.handleUser();
      } else if (lowerCaseMessage.includes("seller")) {
        this.actionProvider.handleSeller();
      } else if (lowerCaseMessage.includes("order")) {
        this.actionProvider.handleOrder();
      } else if (lowerCaseMessage.includes("wishlist")) {
        this.actionProvider.handleWishlist();
      } else if (lowerCaseMessage.includes("complaint")) {
        this.actionProvider.handleComplaint();
      } else if (lowerCaseMessage.includes("login")) {
        this.actionProvider.handleSellerLogin();
      } else if (lowerCaseMessage.includes("catalog")) {
        this.actionProvider.handleCatalog();
      } else if (lowerCaseMessage.includes("shipment")) {
        this.actionProvider.handleShipment();
      } else if (lowerCaseMessage.includes("account")) {
        this.actionProvider.handleAccount();
      } else if (lowerCaseMessage.includes("dashboard")) {
        this.actionProvider.handleDashboard();
      } else {
        this.actionProvider.handleUnknown();
      }
    }
  }
  
  export default MessageParser;
  