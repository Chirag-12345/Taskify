let AddBtn = document.querySelector(".fa-plus");
let ClosBtn = document.querySelector(".fa-xmark");
let myDB = window.localStorage; // Declaration of Database

AddBtn.addEventListener("click", function () {
  openBox();
});

ClosBtn.addEventListener("click", function () {
  document.querySelector(".FillBox").remove();
});

// Add Event listener to buttons to get selected lists
for (let i = 0; i < document.getElementsByClassName("Group-item").length; i++) {
  document
    .getElementsByClassName("Group-item")
    [i].addEventListener("click", function () {
      updatelist(document.getElementsByClassName("Group-item")[i].classList[1]);
    });
}

function openBox() {
  //Working for creation of Div
  let FillBox = document.createElement("div");
  FillBox.innerHTML = `
    <textarea placeholder="Enter The Task Here" id="Task" autocomplete="off"></textarea>
    <div class="Select-Group">
    <button class="Home1">🏠 Home</button>
    <button class="Work1">💼 Work</button>
    <button class="Hobby1">📚Hobby</button>
    </div>
    <button type="submit" id="submit_btn">Submit</button>
    `;
  FillBox.classList.add("FillBox");
  document.querySelector("body").append(FillBox);

  // Working for selection of filter during FillBox
  let arr_btn = document.querySelectorAll("button");
  for (let i = 0; i < 3; i++) {
    let j = i;
    arr_btn[j].addEventListener("click", function (e) {
      if (e.target.classList.contains("selected_bttn")) return;
      else if (document.querySelectorAll(".selected_bttn").length === 0) {
        e.target.classList.add("selected_bttn");
      } else {
        document
          .querySelector(".selected_bttn")
          .classList.remove("selected_bttn");
        e.target.classList.add("selected_bttn");
      }
    });
  }

  //Added Event listener to save button
  let save_btn = document.querySelector("#submit_btn");
  save_btn.addEventListener("click", function () {
    let e = document.querySelector(".selected_bttn").classList[0];
    save_bttn();
    updatelist(e);
  });
}
// Working of Save Button
function save_bttn() {
  let ticketId = uuid();
  let ticketInfoObject = {
    ticketFilter: document.querySelector(".selected_bttn").classList[0],
    ticketValue: document.querySelector("#Task").value,
    ticketId: ticketId,
  };
  //console.log(ticketInfoObject.ticketValue);
  if(ticketInfoObject.ticketValue=="")
  {alert("Task can't be Empty");}
  else{
  save_to_DB(ticketInfoObject); }// To save into actual database
  // To close the box
  ClosBtn.click();
}

// To save to local database
function save_to_DB(ticketInfoObject) {
  let allTasks = myDB.getItem("allTasks");
  if(allTasks){
  if (allTasks != "undefined") {
    allTasks = JSON.parse(allTasks);
    allTasks.push(ticketInfoObject);
    myDB.setItem("allTasks", JSON.stringify(allTasks));
  } }
  else {
    let allTasks = [ticketInfoObject];
    myDB.setItem("allTasks", JSON.stringify(allTasks));
  }
}

// Function to get list of each item
function updatelist(e) {
  if (e.endsWith("1")) {
    e = e.slice(0, e.length - 1);
    if (document.querySelector(".active_group") == null) {
      document.querySelector(`.${e}`).classList.add("active_group");
      displayList(e);
    } else if (document.querySelector(".active_group").classList[1] == e) {
      document.querySelector(".active_group").classList.remove("active_group");
      document.querySelector(`.${e}`).classList.add("active_group");
      displayList(e);
    }
  } else {
    if (document.querySelector(".active_group") == null) {
      document.querySelector(`.${e}`).classList.add("active_group");
      displayList(e);
    } else if (document.querySelector(".active_group").classList[1] != e) {
      document.querySelector(".active_group").classList.remove("active_group");
      document.querySelector(`.${e}`).classList.add("active_group");
      displayList(e);
    }
  }
}

function displayList(e) {
  document.querySelector(".list-list").innerHTML = "";
  let allTasks = localStorage.getItem("allTasks");
  if (allTasks != "undefined") {
    e = e + "1"; //Becuase class of grouplist is home but filter is home1
    allTasks = JSON.parse(allTasks);
    for (let i = 0; i < allTasks.length; i++) {
      if (allTasks[i].ticketFilter == e) {
        InsertList(allTasks[i]);
      }
    }
  } else {
    alert("There is no pending task");
  }
  DeletionList();
}

// Function to insert the list item in viewport
function InsertList(ticketInfoObject) {
  let { ticketFilter, ticketValue, ticketId } = ticketInfoObject;
  let listItm = document.createElement("li");
  listItm.className = "list-item";
  listItm.innerHTML = `
                    ${ticketValue}
                    <div>
                        <i class="fa-solid fa-pen-to-square"></i>
                          <i class="fa-solid fa-trash"></i>
                    
                    </div>
    `;
  document.querySelector(".list-list").append(listItm);
  // To add Functionality of delete button
}

//Function to add working of delete button
function DeletionList() {
  let arr = document.querySelectorAll(".fa-trash");
  for (let i = 0; i < arr.length; i++) {
    arr[i].addEventListener("click", function () {
      let k = i;
      let allTasks = localStorage.getItem("allTasks");
      let grp = document.querySelector(".active_group").classList[1];
      allTasks = JSON.parse(allTasks);
      let grp1 = grp;
      grp = grp + "1";
      let upDatedTasks = [];
      console.log(allTasks);
      for (let j = 0; j < allTasks.length; j++) {
        console.log(allTasks[j]);
        if (allTasks[j].ticketFilter == grp) {
          if (k == 0) {
            k--;
            continue;
          } else {
            upDatedTasks.push(allTasks[j]);
            k--;
          }
          console.log(k);
        } else {
          upDatedTasks.push(allTasks[j]);
        }
      }
      console.log(upDatedTasks);
      myDB.setItem("allTasks", JSON.stringify(upDatedTasks));

      displayList(grp1);
    });
  }
}
