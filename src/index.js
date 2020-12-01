require('./index.css').toString();

const fontFamiliesType = ['Arial', 'Arial Black', 'Arial Narrow', 'Arial Rounded MT Bold',
  'Avant Garde', 'Baskerville', 'Bodoni MT', 'Book Antiqua', 'Big Caslon', 'Calibri', 'Calisto MT', 'Cambria', 'Candara', 'Century Gothic',
  'Charcoal', 'Copperplate',
  'Comic Sans MS', 'Courier New',
  'Didot',
  'Franklin Gothic Medium',
  'Futura', 'Geneva', 'Gill Sans', 'Garamond', 'Georgia', 'Goudy Old Style',
  'Hoefler Text',
  'Helvetica',
  'Helvetica Neue', 'Impact', 'Lucida Sans Unicode', 'Lato', 'Lucida Grande', 'Lucida Bright', 'Monaco', 'Optima', 'Papyrus',
  'PT Mono', 'Palatino', 'Perpetua', 'Rockwell', 'Roboto', 'Rockwell Extra Bold', 'Segoe UI', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana',
];
class FontFamilyTool {
   
   static title = 'Font Family';
   isDropDownOpen = false;
   emptyString = '&nbsp;&nbsp';
   fontFamilyDropDown = 'fontFamilyDropDown';
   fontFamilyBtn = 'fontFamilyBtn';

   static get isInline() {
       return true
   }
   static get sanitize() {
    return {
      font: {
        size: true,
        face: true
      },
    };
  }
   commandName= 'fontName';

    CSS = {
    button: 'ce-inline-tool',
    buttonActive: 'ce-font-family-tool--active',
    buttonModifier: 'ce-inline-tool--font',
  }
    selectedFontFamily = null;

    nodes = {
    button: undefined
  }
    selectionList = undefined;

    buttonWrapperText = undefined;

    togglingCallback = null;

  createButton() {
    this.nodes.button = document.createElement('button');
    this.nodes.button.type = 'button';
    this.nodes.button.classList.add(this.CSS.button, this.CSS.buttonModifier);
    this.nodes.button.setAttribute('id', this.fontFamilyBtn);
    this.getFontFamilyForButton();
    this.nodes.button.appendChild(this.svg('toggler-down', 13, 13));
  }

  getFontFamilyForButton() {
    this.buttonWrapperText = document.createElement('div');
    this.buttonWrapperText.classList.add('button-wrapper-text-font-family');
    const displaySelectedFontFamily = document.createElement('div');
    displaySelectedFontFamily.classList.add('selected-font-family')
    displaySelectedFontFamily.setAttribute('id', this.fontFamilyDropDown);
    displaySelectedFontFamily.innerHTML = this.emptyString;
    this.buttonWrapperText.append(displaySelectedFontFamily);
    this.nodes.button.append(this.buttonWrapperText);
  }

   addFontFamilyOptions() {
    this.selectionList = document.createElement('div');
    this.selectionList.setAttribute('class', 'selectionList-font-family');
    const selectionListWrapper = document.createElement('div');
    selectionListWrapper.setAttribute('class', 'selection-list-wrapper-font');

    for (const value of fontFamiliesType) {
      const option = document.createElement('div');
      option.setAttribute('value', value);
      option.setAttribute('style', `font-family:${value}`);
      option.classList.add('selection-list-option');
      if (document.getElementById(this.fontFamilyDropDown).innerHTML === value || this.selectedFontFamily === value) {
        option.classList.add('selection-list-option-active');
      }
      option.innerHTML = value;
      selectionListWrapper.append(option);
    }

    this.selectionList.append(selectionListWrapper);
    this.nodes.button.append(this.selectionList);
    this.selectionList.addEventListener('click', this.toggleFontFamilySelector);
    setTimeout(() => {
      if (typeof this.togglingCallback === 'function') {
        this.togglingCallback(true);
      }
    }, 50);
  };

  toggleFontFamilySelector = (event) => {
    this.selectedFontFamily = event.target.innerHTML;
    this.toggle();
  }

   removeFontOptions() {
    if (this.selectionList) {
      this.isDropDownOpen = false;
      this.selectionList = this.selectionList.remove();
    }
    if (typeof this.togglingCallback === 'function') {
      this.togglingCallback(false);
    }
  }

   render() {
    this.createButton();
    this.nodes.button.addEventListener('click', this.toggleDropDown);
    return this.nodes.button;
  }

   toggleDropDown = ($event) => {
    if ((($event.target).id === this.fontFamilyDropDown || ($event.target.parentNode.id === this.fontFamilyBtn))) {
      this.toggle((toolbarOpened) => {
        if (toolbarOpened) {
          this.isDropDownOpen = true;
        }
      });
    }
  }

   toggle(togglingCallback) {
    if (!this.isDropDownOpen && togglingCallback) {
      this.addFontFamilyOptions();
    } else {
      this.removeFontOptions();
    }
    if (typeof togglingCallback === 'function') {
      this.togglingCallback = togglingCallback;
    }
  }

   surround(range) {
    if (this.selectedFontFamily) {
      document.execCommand(this.commandName, false, this.selectedFontFamily);
    }
  }

   getComputedFontFamilyStyle(node) {
    return window.getComputedStyle(node.parentElement, null).getPropertyValue('font-family');
  }

   checkState(selection) {
    const isActive = document.queryCommandState(this.commandName);
    let anchoredElementSelectedFont = this.getComputedFontFamilyStyle(selection.anchorNode);
    const focusElementSelectedFont = this.getComputedFontFamilyStyle(selection.focusNode);
    if (anchoredElementSelectedFont === focusElementSelectedFont) {
      if (anchoredElementSelectedFont.slice(0, 1) === '"') {
        anchoredElementSelectedFont = anchoredElementSelectedFont.slice(1, -1);
      }
      else if (anchoredElementSelectedFont.slice(0, 1) === '-') {
        const updatedFont = anchoredElementSelectedFont.slice(anchoredElementSelectedFont.indexOf('"') + 1, anchoredElementSelectedFont.indexOf('"', anchoredElementSelectedFont.indexOf('"') + 1));
        anchoredElementSelectedFont = updatedFont;
      }
      else if (anchoredElementSelectedFont.indexOf(',') !== -1) {
        anchoredElementSelectedFont = anchoredElementSelectedFont.slice(0, anchoredElementSelectedFont.indexOf(','));
      }
      this.replaceFontSizeInWrapper(anchoredElementSelectedFont);
    }
    else {
      const emptyWrapper = this.emptyString;
      this.replaceFontSizeInWrapper(emptyWrapper);
    }
    return isActive;
  }

   replaceFontSizeInWrapper(fontFamily) {
    const displaySelectedFontFamily = document.getElementById(this.fontFamilyDropDown)
    displaySelectedFontFamily.innerHTML = fontFamily;
  }

   clear() {
    this.toggle();
    this.selectedFontFamily = null;
  }

  svg(name, width = 14, height = 14) {
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    icon.classList.add('icon', 'icon--' + name);
    icon.setAttribute('width', width + 'px');
    icon.setAttribute('height', height + 'px');
    icon.innerHTML = `<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#${name}"></use>`;

    return icon;
  }
}
module.exports = FontFamilyTool;