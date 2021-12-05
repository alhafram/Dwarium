document.addEventListener("AttachDND", event => {
  var dragSrcEl = null;

  function handleDragStart(e) {
    this.style.opacity = "0.4";

    dragSrcEl = this;

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", this.innerHTML);
  }

  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    e.dataTransfer.dropEffect = "move";

    return false;
  }

  function handleDragEnter(e) {
    this.classList.add("over");
  }

  function handleDragLeave(e) {
    this.classList.remove("over");
  }

  function handleDrop(e) {
    if (e.stopPropagation) {
      e.stopPropagation(); // stops the browser from redirecting.
    }
    console.log(dragSrcEl, this)
    if (dragSrcEl != this && this.childElementCount == 0 && dragSrcEl.attributes.equiped.value == "false") {
      this.append(dragSrcEl);
      this.style.visibility = "hidden";
      this.children[0].style.visibility = "visible";
      dragSrcEl.attributes.equiped.value = true;
    }

    return false;
  }

  function handleDropIntoAllItems(e) {
    if (e.stopPropagation) {
      e.stopPropagation(); // stops the browser from redirecting.
    }

    if(dragSrcEl != this) {
      dragSrcEl.parentElement.style.visibility = "visible";
      dragSrcEl.attributes.equiped.value = false;
      document.querySelectorAll(".current_items")[0].appendChild(dragSrcEl);
    }

    return false;
  }

  function handleDragOverAllItems(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    e.dataTransfer.dropEffect = "move";

    return false;
  }

  function handleDragEnd(e) {
    this.style.opacity = "1";

    items.forEach(function(item) {
      item.classList.remove("over");
    });
  }

  function doubleClickEquipedItem(e) {
    if(this.attributes.equiped.value == "true" && e.detail == 2) {
      this.parentElement.style.visibility = "visible";
      this.attributes.equiped.value = false;
      document.querySelectorAll(".current_items")[0].appendChild(this);
    }
  }

  let items = document.querySelectorAll(".current_items .box");
  items.forEach(function(item) {
    item.addEventListener("dragstart", handleDragStart, false);
    item.addEventListener("dragend", handleDragEnd, false);
    item.addEventListener("click", doubleClickEquipedItem, false);
  });

  let equip_items = document.querySelectorAll(".equipped_items .box_static");
  equip_items.forEach(function(item) {
    item.addEventListener("dragenter", handleDragEnter, false);
    item.addEventListener("dragover", handleDragOver, false);
    item.addEventListener("dragleave", handleDragLeave, false);
    item.addEventListener("drop", handleDrop, false);
  });

  let all_items = document.querySelectorAll(".current_items");
  all_items.forEach(function(item) {
    item.addEventListener("drop", handleDropIntoAllItems, false);
    item.addEventListener("dragover", handleDragOverAllItems, false);
  });
});
