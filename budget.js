
var budgetCalculator = (function(){

  var  Expense = function(id, item, cost){
    this.id =id;
    this.item =item;
    this.cost =cost;

  };

  var  Income = function(id, item, cost){
    this.id =id;
    this.item =item;
    this.cost =cost;
  };

    var allExp = [];
    var allInc = [];
    var totalExp = 0; 
    var totalInc = 0;

    return{
        addItem: function(type, item, cost){
                var currItem, ID
                if (type === 'Minus'){
                ID = parseInt((allExp.length)) + 1;
                currItem = new Expense(ID, item, cost)
                allExp.push(currItem)

                }else if (type ==='Plus'){
                ID = parseInt((allInc.length)) + 1;
                currItem = new Income(ID, item, cost)
                allInc.push(currItem)
                }
                console.log(allInc, allExp)
                return {
                    currItem
                }
        },

        calcTotal: function(type, cot){

            cost = parseInt(cot)
            if(type === "Plus"){

                totalInc += cost
            }else if (type ==="Minus"){

                totalExp += cost
            }
            // var elem

            // allInc.forEach(element => {
            //     elem = parseInt(element.cost)
            //     totalInc += elem
            // });
            // allExp.forEach(element => {
            //     elem = parseInt(element.cost)
            //     totalExp += elem
            // });

            return{
                totalInc, totalExp
            }
 
        },

        deleteItem: function(type, id){

            if(type === 'inc'){

                ids = allInc.map(function(current){
                return current.id               
                });

                index = ids.indexOf(id)
                allInc.splice(index, 1);
                console.log(allInc, allExp)
            }else if(type=== 'exp'){

                ids = allExp.map(function(current){
                return current.id               
                });
    
                index = ids.indexOf(id)
                allExp.splice(index, 1);
                console.log(allExp, allInc)
            }
        },

        reCalc: function(id, typ){
            var par, val, fin
        
            par = document.getElementById(id)
            val = par.childNodes[2].textContent;

           fin = parseInt(val.substring(2, val.length))

           console.log(fin)
           if (typ === 'inc'){

            totalInc = totalInc - fin

           }else if (typ === 'exp'){

            totalExp = totalExp - fin

           }

           return{

            totalInc, totalExp
           }


        }         
    }
})()

var UIDisplay = (function(){

   var DOMList = {
     type_c : '.types',
     item_c : '.item_name',
     cost_c : '.cost',
     ok_btn : '.ok_button',
     expense_contain: '.expense_container',
     income_contain: '.income_container',
     income_1: '.i_number',
     expense_1: '.e_number',
     budget: '.budget_display',
     nix: '.item__delete--btn',
     container: '.incexp_container'
   }

    return{

            DOMs: function(){
             return DOMList;
            },

            getInput: function(){
                return {
                    type : document.querySelector(DOMList.type_c).value,
                    item : document.querySelector(DOMList.item_c).value,
                    cost : document.querySelector(DOMList.cost_c).value,  
                }
            },

            displayInput: function(obj, type){
                var html, newHtml, elem

                if (type=== 'Minus'){
                    elem  = DOMList.expense_contain
                    html = '<div class="ingoes" id="exp-&id"><div class ="zitem d-md-flex">&item</div><div class="nix float-right"><button type ="button" class="item__delete--btn btn-close"></button></div><div class="zamount d-md-flex">- &amt</div></div>'
                }else if(type === 'Plus'){
                    elem = DOMList.income_contain
                    html = '<div class="ingoes" id="inc-&id"><div class ="zitem d-md-flex">&item</div><div class="nix float-right"><button type ="button" class="item__delete--btn btn-close"></button></div><div class="zamount d-md-flex">+ &amt</div></div>'
                }

                newHtml = html.replace('&id', obj.id )
                newHtml = newHtml.replace('&item', obj.item )
                newHtml = newHtml.replace('&amt', obj.cost )

                document.querySelector(elem).insertAdjacentHTML('beforeend', newHtml )
            },

            displayTots: function(tots){
                document.querySelector(DOMList.income_1).innerHTML = tots.totalInc
                document.querySelector(DOMList.expense_1).innerHTML = tots.totalExp
            },

            maindisplay: function(tots){
                var somit = tots.totalInc - tots.totalExp;
                document.querySelector(DOMList.budget).innerHTML = (somit)
                
                if(somit< 0){
                    document.querySelector(DOMList.budget).id = 'negative'
                }else{
                    document.querySelector(DOMList.budget).id = 'positive'
                }
                

            },

            removeItem: function(id){
               var el = document.getElementById(id)
               el.parentNode.removeChild(el)
            }
    } 
})()


var Controller = (function(budCalc, udisplay){
   // myChart()
    var DOM = udisplay.DOMs();
    var setEventListeners = function(){
        document.querySelector(DOM.ok_btn).addEventListener('click', okbtnclicked);
        document.querySelector(DOM.container).addEventListener('click', nixbtnclicked);
    }


    var okbtnclicked = function(){
        var inputGot, newItem, toast
        //get input value
        inputGot = udisplay.getInput() 

        if ((!isNaN(inputGot.cost) && inputGot.cost !== "") && inputGot.type !=="Select-an-Option" && inputGot.item !==""){ 

        //store values
        newItem = budCalc.addItem(inputGot.type, inputGot.item, inputGot.cost)
        //display in UI
        udisplay.displayInput(newItem.currItem, inputGot.type)
        //calculate total
        toast = budCalc.calcTotal(inputGot.type, inputGot.cost)
        //display income/expense
         udisplay.displayTots(toast)
        //maindisplay
        udisplay.maindisplay(toast)
        updateChart(toast)
        end()

    }else {
        alert('Not valid')
    }
    }

    var nixbtnclicked = function(event){
    var itID, spit, typ, ID, finale
        //get id and value
        itID = (event.target.parentNode.parentNode.id)

        spit = itID.split('-')
        typ = spit[0];
        ID = spit[1];

        //remove form array
        budCalc.deleteItem(typ, ID)

        //recalculate budget
        finale = budCalc.reCalc(itID, typ);

        //remove from ui
        udisplay.removeItem(itID);

        udisplay.displayTots(finale);

        udisplay.maindisplay(finale);
        updateChart(toast)

    }

    let myChart = document.getElementById('myChart').getContext('2d');
    console.log(DOM.expense_1, DOM.income_1)


    var randomChart = new Chart(myChart, {
        type: 'doughnut',
        data:{
            labels:['Income', 'Expense'],
            datasets:[{
                label: 'Stuff',
                data:[1,0],
                backgroundColor: [
                    'green',
                    'crimson',]
            }],
            hoverOffset: 4
        },
        options: {
            // responsive: false,
            maintainAspectRatio: false
        }

    })

    randomChart.canvas.parentNode.style.height = '150px';
    randomChart.canvas.parentNode.style.width = '600px';
   // randomChart.canvas.parentNode.style.display = 'contents'
    //randomChart.canvas.parentNode.style

    var updateChart = function(toast){
        console.log(toast)
       randomChart.data.datasets[0].data = [];
       randomChart.data.datasets[0].data.push(toast.totalInc, toast.totalExp);
       randomChart.update()

       console.log(randomChart.data.datasets[0])
    }


    var end =  function(){
        document.querySelector(DOM.type_c).value = "placeholder"
        document.querySelector(DOM.item_c).value = ""
        document.querySelector(DOM.cost_c).value = ""

    }

    return {
        init : function(){
            document.querySelector(DOM.type_c).value = "placeholder"
            document.querySelector(DOM.item_c).value = ""
            document.querySelector(DOM.cost_c).value = ""
            document.querySelector(DOM.budget).innerHTML = "  " +0
            document.querySelector(DOM.income_1).innerHTML = "  " +0
            document.querySelector(DOM.expense_1).innerHTML = "  " +0
            setEventListeners();    
        }
    }


})(budgetCalculator, UIDisplay)

Controller.init();

