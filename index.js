// console.log("hello world")
new Vue({
    el: "#root",
    data:{
        title: "Foodigo Restaurant Dashboard",
        orders:[
            {name:"Chris Nwamba", description:"Rice and Ofe-Akwu", address:"Lekki", telephone:"08082092000", open:true},
            {name:"William Imoh", description:"Rice and Chicken", address:"Amuwo", telephone:"08082818700", open:true}
        ]
    },
    created(){
        var pusher = new Pusher('2dd6b95d32efbc7fa4ad',{
            cluster:'eu',
            encrypted:true
        })
        var channel = pusher.subscribe('orders')
        channel.bind('customerOrder', (data) => {
            console.log(data)
            this.orders.push(data)
        })
    },
    methods:{
        // close completed order
        close(orderToClose){
            if ( confirm('Are you sure you want to close the order?') === true){
                this.orders = this.orders.map(order => {
                    if(order.name !== orderToClose.name && order.description !== orderToClose.description){
                        return order;
                    }
                    const change = {
                        open: !order.open
                    }
                    return change;
                })
            } 
        }
    }
})