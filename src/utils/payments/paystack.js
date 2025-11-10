import Paystack from "@paystack/paystack-sdk";

class PaystackClient{
    constructor(){
        this.paystack = new Paystack(process.env.PAYSTACK_KEY);
    }

    getPaystackClient() {
        return this.paystack;
    }
}

const paystack = new PaystackClient();

export default paystack;