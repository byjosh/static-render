/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   Supplemental JS for the disclosure menu keyboard behavior
 */

'use strict';

class DisclosureNav {
    constructor(domNode, alllinks) {
        this.rootNode = domNode;
        this.linklist = alllinks
        this.controlledNodes = [];
        this.openIndex = null;
        this.useArrowKeys = true; //was true changed
        this.topLevelNodes = [
            ...this.rootNode.querySelectorAll(
                'header > a,a.top-level,.disclosure-nav .main-link, .disclosure-nav button[aria-expanded][aria-controls]' //  and changed to body as root node added top level node selector
            ),

        ];
        console.log(this.topLevelNodes);
        console.log("those were top level nodes")
        console.log(this.linklist);
        console.log("those were all link nodes")
        this.topLevelNodes.forEach((node) => {
            // handle button + menu
            if (
                node.tagName.toLowerCase() === 'button' &&
                node.hasAttribute('aria-controls')
            ) {
                const menu = node.parentNode.querySelector('ul');
                if (menu) {
                    // save ref controlled menu
                    this.controlledNodes.push(menu);

                    // collapse menus
                    node.setAttribute('aria-expanded', 'false');
                    this.toggleMenu(menu, false);

                    // attach event listeners
                    menu.addEventListener('keydown', this.onMenuKeyDown.bind(this));
                    node.addEventListener('click', this.onButtonClick.bind(this));
                    node.addEventListener('keydown', this.onButtonKeyDown.bind(this));
                }
            }
            // handle links
            else {
                this.controlledNodes.push(null);//was null pushed
                node.addEventListener('keydown', this.onLinkKeyDown.bind(this));
            }
        });

        this.rootNode.addEventListener('focusout', this.onBlur.bind(this));
    }

    controlFocusByKey(keyboardEvent, nodeList, currentIndex) {
        var keyevent = "";
        console.log("node list length = ", nodeList.length);
        if (keyboardEvent.shiftKey && keyboardEvent.keyCode == 9) {
            keyevent = "BothShiftandTab";
        }
        else {
            keyevent = keyboardEvent.key;
        }
        switch (keyevent) {
            case 'ArrowUp':
            case 'ArrowLeft':
                keyboardEvent.preventDefault()
                if (currentIndex > -1) {
                    var prevIndex = currentIndex - 1
                    if (prevIndex > -1) {
                        nodeList[prevIndex].focus();
                    }
                    else {
                        currentIndex = -1
                    }

                }
                break;
            case "BothShiftandTab":
                console.log("current index- shift tabbing ", currentIndex)

                if (currentIndex > -1) {
                    var prevIndex = currentIndex - 1
                    console.log("previousindex, shift tabbing -", prevIndex)
                    if (prevIndex > -1) {
                        break;
                        //focus shift is not needed as default action does this already
                        //nodeList[prevIndex].focus;
                    }
                    else {
                        console.log("we did the else & subtraction")
                        currentIndex = -1
                    }

                }
                break;
            case 'ArrowDown':
            case 'ArrowRight':
            case 'Tab': //add Tab
                console.log("current index- arrows down/right/ tab key ", currentIndex)
                if (currentIndex > -1) {
                    var nextIndex = currentIndex + 1;
                    //changed nodelist.length -1 to node list length as max next index
                    console.log("next index", nextIndex);
                    if (nextIndex < nodeList.length) {
                        keyboardEvent.preventDefault();
                        nodeList[nextIndex].focus();
                    }
                    else {
                        currentIndex = -1;
                    }

                }
                break;
            case 'Home':
                keyboardEvent.preventDefault();
                nodeList[0].focus();
                break;
            case 'End':
                keyboardEvent.preventDefault();
                nodeList[nodeList.length - 1].focus();
                break;
        }
    }

    // public function to close open menu
    close() {
        this.toggleExpand(this.openIndex, false);
    }

    onBlur(event) {
        var menuContainsFocus = this.rootNode.contains(event.relatedTarget);
        if (!menuContainsFocus && this.openIndex !== null) {
            this.toggleExpand(this.openIndex, false);
        }
    }

    onButtonClick(event) {
        var button = event.target;
        var buttonIndex = this.topLevelNodes.indexOf(button);
        var buttonExpanded = button.getAttribute('aria-expanded') === 'true';
        this.toggleExpand(buttonIndex, !buttonExpanded);
    }

    onButtonKeyDown(event) {
        var targetButtonIndex = this.topLevelNodes.indexOf(document.activeElement);

        // close on escape
        if (event.key === 'Escape') {
            this.toggleExpand(this.openIndex, false);
        }

        // move focus into the open menu if the current menu is open
        else if (
            this.useArrowKeys &&
            this.openIndex === targetButtonIndex &&
            event.key === 'ArrowDown'
        ) {
            event.preventDefault();
            this.controlledNodes[this.openIndex].querySelector('a').focus();
        }

        // handle arrow key navigation between top-level buttons, if set
        else if (this.useArrowKeys) {
            this.controlFocusByKey(event, this.topLevelNodes, targetButtonIndex);
        }
    }

    onLinkKeyDown(event) {
        var targetLinkIndex = this.topLevelNodes.indexOf(document.activeElement);

        // handle arrow key navigation between top-level buttons, if set
        if (this.useArrowKeys) {
            this.controlFocusByKey(event, this.topLevelNodes, targetLinkIndex);
        }
    }

    onMenuKeyDown(event) {
        if (this.openIndex === null) {
            return;
        }

        var menuLinks = Array.prototype.slice.call(
            this.controlledNodes[this.openIndex].querySelectorAll('a')
        );
        var currentIndex = menuLinks.indexOf(document.activeElement);

        // close on escape
        if (event.key === 'Escape') {
            this.topLevelNodes[this.openIndex].focus();
            this.toggleExpand(this.openIndex, false);
        }

        // handle arrow key navigation within menu links, if set
        else if (this.useArrowKeys) {
            this.controlFocusByKey(event, menuLinks, currentIndex);
        }
    }

    toggleExpand(index, expanded) {
        // close open menu, if applicable
        if (this.openIndex !== index) {
            this.toggleExpand(this.openIndex, false);
        }

        // handle menu at called index
        if (this.topLevelNodes[index]) {
            this.openIndex = expanded ? index : null;
            this.topLevelNodes[index].setAttribute('aria-expanded', expanded);
            this.toggleMenu(this.controlledNodes[index], expanded);
        }
    }

    toggleMenu(domNode, show) {
        if (domNode) {
            domNode.style.display = show ? 'flex' : 'none';
        }
    }

    updateKeyControls(useArrowKeys) {
        this.useArrowKeys = useArrowKeys;
    }
}

/* Initialize Disclosure Menus */

window.addEventListener(
    'load',
    function () {
        var menus = document.querySelectorAll('.disclosure-nav');
        var disclosureMenus = [];
        var links = document.querySelectorAll("a[tabindex]");
        for (var i = 0; i < menus.length; i++) {
            disclosureMenus[i] = new DisclosureNav(menus[i], links);
        }
    },
    false
);
