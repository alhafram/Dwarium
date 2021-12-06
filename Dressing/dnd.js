document.addEventListener("AttachDND", event => {

    var dragSrcEl = null
    var armorTypeSelected = null

    function handleDragStartEquipableItem(e) {
        this.style.opacity = "0.4"
        dragSrcEl = this;
        e.dataTransfer.setData("text/html", this.innerHTML);
    }

    function handleDragOverStaticItemBox(e) {
        if(e.preventDefault) {
            e.preventDefault()
        }
        return false;
    }

    function handleDropEquipableItemOnStaticItemBox(e) {
        if(e.stopPropagation) {
            e.stopPropagation()
        }
        if(dragSrcEl != this && this.childElementCount == 0 && dragSrcEl.attributes.equiped.value == "false" && dragSrcEl.attributes.type.value == this.attributes.type.value) {
            this.append(dragSrcEl);
            this.style.visibility = "hidden";
            this.children[0].style.visibility = "visible";
            dragSrcEl.attributes.equiped.value = true;
        }
        armorTypeSelected = null
        return false;
    }

    function handleDropEquipableItemIntoAllItems(e) {
        if(e.stopPropagation) {
            e.stopPropagation();
        }
        if(dragSrcEl != this) {
            dragSrcEl.parentElement.style.visibility = "visible";
            dragSrcEl.attributes.equiped.value = false;
            document.querySelectorAll(".current_items")[0].appendChild(dragSrcEl);
        }
        return false;
    }

    function handleDragOverEquipableItemOverAllItems(e) {
        if(e.preventDefault) {
            e.preventDefault();
        }
        return false;
    }

    function handleDragEndEquipableItem(e) {
        this.style.opacity = "1"
    }

    function handleClickEquipableItem(e) {
        if(e.detail == 1) {
          return
        }
        if(this.attributes.equiped.value != "true" && e.detail == 2) {
            let item_box_arr = Array.from(document.querySelector('.equipped_items').children).filter(e => e.id == this.attributes.type.value)
            if(item_box_arr.length > 0) {
                let item_box = item_box_arr[0].children[0]
                if(item_box.childElementCount == 1) {
                    let equiped_item = item_box.children[0]
                    equiped_item.attributes.equiped.value = false;
                    document.querySelectorAll(".current_items")[0].appendChild(equiped_item);
                }
                item_box.append(this);
                item_box.style.visibility = "hidden";
                item_box.children[0].style.visibility = "visible";
                this.attributes.equiped.value = true;
                if(armorTypeSelected) {
                    document.getElementById(armorTypeSelected + "_box").style.border = ""
                    armorTypeSelected = null
                    filterCurrentItems()
                }
            }
            return
        }
        if(this.attributes.equiped.value == "true" && e.detail == 2) {
            this.parentElement.style.visibility = "visible";
            this.attributes.equiped.value = false;
            document.querySelectorAll(".current_items")[0].appendChild(this);
            if(armorTypeSelected) {
                filterCurrentItems()
            }
            e.stopPropagation()
        }
    }

    let items = document.querySelectorAll(".current_items .box");
    items.forEach(function(item) {
        item.addEventListener("dragstart", handleDragStartEquipableItem, false);
        item.addEventListener("dragend", handleDragEndEquipableItem, false);
        item.addEventListener("click", handleClickEquipableItem, false);
    });

    let equip_items = document.querySelectorAll(".equipped_items .box_static");
    equip_items.forEach(function(item) {
        item.addEventListener("dragover", handleDragOverStaticItemBox, false);
        item.addEventListener("drop", handleDropEquipableItemOnStaticItemBox, false);
    });

    let all_items = document.querySelectorAll(".current_items");
    all_items.forEach(function(item) {
        item.addEventListener("drop", handleDropEquipableItemIntoAllItems, false);
        item.addEventListener("dragover", handleDragOverEquipableItemOverAllItems, false);
    });

    let armor_types = ['helmet', 'shoulders', 'bracers', 'main_weapon', 'offhand_weapon', 'cuirass', 'leggings', 'chain_mail', 'boots']
    armor_types.forEach(t => {
        document.getElementById(t + "_box").addEventListener('click', (e) => {
            if(document.getElementById(t + "_box").childElementCount == 1) {
              return
            }
            if(document.getElementById(t + "_box").style.border == "" && document.getElementById(t + "_box").childElementCount == 0) {
                if(armorTypeSelected != null) {
                    document.getElementById(armorTypeSelected + "_box").style.border = ""
                    armorTypeSelected = null
                    filterCurrentItems()
                }
                armorTypeSelected = t
                document.getElementById(t + "_box").style.border = '3px dotted #666'
                filterCurrentItems()
            } else {
                document.getElementById(t + "_box").style.border = ""
                armorTypeSelected = null
                filterCurrentItems()
            }
        });
    })

    function filterCurrentItems() {
        let items = Array.from(document.querySelector('.current_items').children)
        items.forEach(i => {
            if(armorTypeSelected) {
                if(i.attributes.type.value == armorTypeSelected) {
                    i.style.display = 'inline-block'
                } else {
                    i.style.display = 'none'
                }
            } else {
                i.style.display = 'inline-block'
            }
        })
    }
});
