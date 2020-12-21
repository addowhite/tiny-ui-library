const get = document.getElementById.bind(document);
const html = str => create('template', { innerHTML: str }).content;
const create = (tagname, attrs) => {
  const el = document.createElement(tagname);
  if (attrs && attrs.innerHTML && !attrs.innerHTML.charAt) {
    el.appendChild(create_frag(attrs.innerHTML));
    delete attrs.innerHTML;
  }
  return Object.assign(el, attrs);
}
const create_frag = (obj, parent) => {
  if (obj instanceof Component) {
    if (parent) obj.parent = parent;
    obj.container = create(obj.tagName || obj.container?.tagName || 'div', { id: obj.id || obj.container?.id || '', className: obj.props.className || '', style: obj.props.style });
    obj.container.appendChild(create_frag(obj.construct(), obj));
    return obj.container;
  } else if (obj.indexOf) {
    if (obj.charAt) return html(obj);
    else {
      const frag = document.createDocumentFragment();
      for (const elm of obj) frag.appendChild(create_frag(elm, parent));
      return frag;
    }
  }
  return obj;
}
class Component {
  constructor(props, container) {
    this.props = props || {};
    this.container = container;
  }
  set(props) {
    if ('className' in props) this.container.className = props.className;
    Object.assign(this.props, props);
    if (this.props.notify_parent) {
      delete this.props.notify_parent;
      this.parent.render();
    } else this.render();
  }
  render(into) {
    if (into) this.container = into.appendChild(create('div'));
    if (!this.container) return;
    this.container.replaceWith(create_frag(this));
    return this;
  }
}
