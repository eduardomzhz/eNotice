/**
 * -------------------------------------------------------------------
 * @author Eduardo Martínez <eduardo.mzhz@gmail.com>
 * @version 1.3 | January 2018
 * -------------------------------------------------------------------
 */

 /**
  * @class
  * @property [string] message - Text of the notice
  * @property [string] animation - Entrance animation
  * @property [string] color - Border and background color
  * @property [number] duration - Time displayed in milliseconds
  * @property [object] position - Position in window by axis
  * @property [string] stack - Position in the line
  * @property [boolean] isVisible - Is currently visible
  * @property [function] onClose - Callback function when closed
  * @property [HTMLElement] container - Container of the element
  * @property [HTMLElement] element - Representation in the DOM
  */
class eNotice {
  /**
   * @constructor
   * @param [string] message - Text to display
   * @param [object] options - Optional settings
   */
  constructor(message, options) {
    options = options || {};
    this.message = message || '';
    this.animation = options.animation || 'pulse';
    this.color = options.color || 'black';
    this.duration = options.duration || 0;
    this.position = options.position || { x: 'right', y: 'bottom' };
    this.stack = options.stack || 'last';
    this.onClose = options.onClose || this.delete;
    this.element = this._setElement();
    this.show();
  }

  /**
   * Removes the notice from the DOM
   * @method
   */
  close() {
    if (this.isVisible) {
      this.element.style.opacity = 0;
      setTimeout(function() {
        this.element.remove();
        this.isVisible = document.body.contains(this.element);
        if (this.container.children.length === 0) {
          this.container.remove();
        }
        if (typeof(this.onClose) === 'function') {
          this.onClose();
        }
      }.bind(this), 400);
    }
  }

  /**
   * Converts the instance to an empty object
   * @method
   */
  delete() {
    this.close();
    setTimeout(function() {
      Object.setPrototypeOf(this, null);
      Object.keys(this).map((property) => {
        delete this[property];
      });
    }.bind(this), 500);
  }

  /**
   * Displays the notice
   * @method
   */
  show() {
    this.element.style.opacity = 1;
    this.container = this._setContainer();
    this._insertElement();
    this.isVisible = document.body.contains(this.element);
    if (this.duration > 0) {
      setTimeout(this.close.bind(this), this.duration);
    }
  }

  /**
   * Stacks the element in the container
   * @method
   */
  _insertElement() {
    if (this.stack === 'last') {
      if (this.position.y === 'bottom') {
        this.container.insertBefore(this.element, this.container.firstChild);
      } else {
        this.container.appendChild(this.element);
      }
    } else {
      if (this.position.y === 'bottom') {
        this.container.appendChild(this.element);
      } else {
        this.container.insertBefore(this.element, this.container.firstChild);
      }
    }
  }

  /**
   * Defines the HTML container or creates it if not exist
   * @method
   * @return [HTMLElement] - Container of the element
   */
  _setContainer() {
    let container = document.getElementById('enotice-' + this.position.y + '-' + this.position.x);
    if (container === null) {
      container = document.createElement('div');
      container.id = 'enotice-' + this.position.y + '-' + this.position.x;
      container.classList.add('en-container');
      container.classList.add('en-' + this.position.y);
      container.classList.add('en-' + this.position.x);
      document.body.appendChild(container);
    }
    return container;
  }

  /**
   * Creates the HTML element of the notice
   * @method
   * @return [HTMLElement] - Notice element
   */
  _setElement() {
    const element = document.createElement('div');
    const button = document.createElement('span');
    const text = document.createTextNode(this.message);
    button.innerHTML = '&times';
    button.addEventListener('click', this.close.bind(this));
    element.appendChild(button);
    element.appendChild(text);
    element.classList.add('en-element');
    element.classList.add('en-' + this.animation);
    element.classList.add('en-' + this.color);
    return element;
  }
}
