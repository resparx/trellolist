// const fetch = require('node-fetch')
$(document.body).append('<div class="container"></div>');
$(".container").append("<h1>trello project</h1>");
$(".container").append(`<form id="additem"><input class='inputBox' type='text'/>
<input type="submit"/> </form>`)
$(".container").append($("<ul></ul>"))
$("ul").addClass("list");


let myKey = 'e9f6b6e9ea59f3d7feb929a2d00ba91e';
let myToken = 'fb7e25a8ad867e3c5cf8797c5b4f0d73033caa5cc33eaef21c2aa3a1492bdad7';
let myBoardId = 'NeWxe5e7';

var trelloList = (key, token, id) => {
    return fetch(`https://api.trello.com/1/boards/${id}/lists?key=${key}&token=${token}`)
        .then((data) => {
            return data.json()
        }
        )
}

async function trelloGetCards(key, token) {
    var listid = await trelloList(myKey, myToken, myBoardId);
    // console.log(listid);
    let myListId = listid.reduce((acc, val) => {
        if (val.name === 'test') {
            acc = val.id
            return acc
        }
    })
    // console.log(myListId)
    return fetch(`https://api.trello.com/1/lists/${myListId}/cards?key=${key}&token=${token}`)
        .then((data) => {
            return data.json()
        })
}
// trelloGetCards(myKey, myToken) 

async function trelloGetCheckLists(key, token) {
    let cards = await trelloGetCards(myKey, myToken);
    let cardIds = cards.reduce((acc, val) => {
        acc.push(val.id)
        return acc
    }, [])
    // console.log(cardIds)
    return cardIds.map((cardid) => {
        return fetch(`https://api.trello.com/1/cards/${cardid}/checklists?key=${key}&token=${token}`)
            .then(data => {
                return data.json()
            })
    })
    // return checklist
}

//  console.log(trelloGetCheckLists())


async function trelloGetCheckListsItems() {
    var items = await trelloGetCheckLists(myKey, myToken);
    return Promise.all(items)
}

async function mergeChecklistItems() {
    let getAllItems = await trelloGetCheckListsItems();
    let allItem = getAllItems.flat()
    // console.log(allItem)
    // console.log(getAllItems.flat())
    var getAllCheckItems = []
    let allCheckItems = allItem.reduce((acc, val) => {
        for (let i in val['checkItems']) {
            getAllCheckItems.push(val['checkItems'][i])
            //    console.log(val['checkItems'][i])
        }
    }, [])
    console.log(allItem, getAllCheckItems)

    return returnItems = [getAllCheckItems, allItem]

}

async function displaymergeChecklistItems() {
    var displayItems = await mergeChecklistItems();
    let checklists = await trelloGetCheckListsItems(myKey, myToken)
    let finalchecklists = checklists.flat()
    // console.log(finalchecklists)
    //  $(".list li").append(``)


    for (item of displayItems[0]) {
        // console.log(item)
        $(".list").append(`<li><input type="checkbox" class="chkbox"  />${item.name}</li>`)
            .css({
                'list-style': 'none',
                'font-size': '18pt',
            })

    }
    for (let i = 0; i < displayItems[0].length; i++) {
        // console.log(displayItems[0][0])
        $("li").each(function (i) {
            $(this).attr({
                'itemId': displayItems[0][i].id,
                'checklistId': displayItems[0][i].idChecklist,
                'state': displayItems[0][i].state
            });
            if ($(this).attr('state') == 'complete') {
                $(this).children().prop("checked", true);
                $(this).css('textDecoration',
                    'line-through'
                );
            }
        })


    }
    // console.log(displayItems[1])


    $("li").each(function (i) {
        for (let j = 0; j < displayItems[1].length; j++) {
            // console.log($("li").attr('checkListId'))
            if ($(this).attr('checkListId') == displayItems[1][j].id) {
                $(this).attr({
                    'cardId': displayItems[1][j].idCard

                });
            }
        }
    }
    )

    $(".list li").each(function (i) {
        $(this).attr({
            'name': $(this).text()
        });
    })

    $("li").addClass("listitems")
    $("li").append(`<button class="deleteitem">x</button>`)
    $("button").click(deleteItem)

    $(".chkbox").click(function updateItem() {
        let checklistid = $(this).parent().attr('checklistid')
        let cardid = $(this).parent().attr('cardid')
        let checkitemid = $(this).parent().attr('itemid')
        let state = $(this).parent().attr('state')

        $('.chkbox:checkbox').change(function () {
            var checkbox = this;
            console.log(checkbox.checked)
            if(checkbox.checked){
                state = 'complete'
            } else{
                state = 'incomplete'
            }
            
            var updateComplete = fetch(`https://api.trello.com/1/cards/${cardid}/checklist/${checklistid}/checkItem/${checkitemid}?key=${myKey}&token=${myToken}&state=${state}`,{method:'put'})     

            $(this).parent().css('textDecoration', function () {
                return checkbox.checked ? 'line-through' : "";
            });

        });
    })

    $("#additem").on('submit', function () {
        let btn = $(this).children().val();
        var enter = fetch(`https://api.trello.com/1/checklists/${$(".listitems").attr('checklistid')}/checkItems?key=${myKey}&token=${myToken}&name=${btn}&pos=bottom&checked=false`, { method: "POST" })
    })


}


function deleteItem() {

    var del = fetch(`https://api.trello.com/1/checklists/${$(this).parent().attr('checklistid')}/checkItems/${$(this).parent().attr('itemid')}?&key=${myKey}&token=${myToken}`, { method: 'delete' }).then(data => {
        if (data.status == 200) {
            $(this).parent().remove()
        }
    })
}
// function updateItem(key){

// console.log($(this).attr('to'))
// $(":checkbox").prop("checked", function(){
//     if($(this).parent().attr('state')=='complete'){
//         return true
//     }

// });

// console.log($(this).attr('to'));
// var updateComplete = fetch(`https://api.trello.com/1/cards/${$(this).parent().attr('cardid')}/checklist/${$(this).parent().attr('checklistid')}/checkItem/${$(this).parent().attr('itemid')}?key=${myKey}&token=${myToken}&state=${$(this).attr('to')}`,{method:'put'})

// }

displaymergeChecklistItems();
