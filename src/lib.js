const get = document.getElementById.bind(document);
const html = str => create('template', { innerHTML: str }).content;
const create_frag = (arr, parent) => {
  if (!arr.indexOf || arr.charAt) arr = [arr];
  const frag = document.createDocumentFragment();
  for (const elm of arr)
    if (elm instanceof Component) {
      elm.parent = parent;
      elm.container = create('div', { style: elm.props.style, className: elm.props.className });
      elm.container.appendChild(create_frag(elm.construct(), elm));
      frag.appendChild(elm.container);
    }
    else if (elm.indexOf && elm.charAt) frag.appendChild(html(elm));
    else frag.appendChild(elm);
  return frag;
}
const create = (tagname, attrs) => {
  const el = document.createElement(tagname);
  if (attrs.innerHTML && !attrs.innerHTML.charAt) {
    el.appendChild(create_frag(attrs.innerHTML));
    delete attrs.innerHTML;
  }
  return Object.assign(el, attrs);
}
class Component {
  constructor(props, container) {
    this.props = props || {};
    this.container = container;
  }
  set(props) {
    if ('className' in props) {
      this.container.className = props.className;
      delete props.className;
    }
    if (props.notify_parent) {
      delete props.notify_parent;
      Object.assign(this.props, props);
      this.parent.render();
    } else {
      Object.assign(this.props, props);
      this.render();
    }
  }
  render() {
    if (!this.container) return;
    this.container.innerHTML = '';
    this.container.appendChild(create_frag(this.construct(), this));
    return this;
  }
}
