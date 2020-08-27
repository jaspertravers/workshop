// https://github.com/marijnh/Eloquent-JavaScript/blob/master/html/js/sandbox.js
export const minimumSandbox = (function() {
  window.Output = class {
  constructor(div) { this.div = div }

  clear() {
    let clone = this.div.cloneNode(false)
    this.div.parentNode.replaceChild(clone, this.div)
    this.div = clone
  }

  out(type, args) {
    let wrap = document.createElement("pre")
    wrap.className = "sandbox-output-" + type
    for (let i = 0; i < args.length; ++i) {
      let arg = args[i]
      if (i) wrap.appendChild(document.createTextNode(" "))
      if (typeof arg == "string")
        wrap.appendChild(document.createTextNode(arg))
      else
        wrap.appendChild(represent(arg, 58))
    }
    this.div.appendChild(wrap)
  }
}

function span(type, text) {
  let sp = document.createElement("span")
  sp.className = "sandbox-output-" + type
  sp.appendChild(document.createTextNode(text))
  return sp
}

function eltSize(elt) {
  return elt.textContent.length
}

function represent(val, space) {
  if (typeof val == "boolean") return span("bool", String(val))
  if (typeof val == "number") return span("number", String(val))
  if (typeof val == "string") return span("string", JSON.stringify(val))
  if (typeof val == "symbol") return span("symbol", String(val))
  if (val == null) return span("null", String(val))
  if (Array.isArray(val)) return representArray(val, space)
  else return representObj(val, space)
}

function representArray(val, space) {
  space -= 2
  let wrap = document.createElement("span")
  wrap.appendChild(document.createTextNode("["))
  for (let i = 0; i < val.length; ++i) {
    if (i) {
      wrap.appendChild(document.createTextNode(", "))
      space -= 2
    }
    let next = space > 0 && represent(val[i], space)
    let nextSize = next ? eltSize(next) : 0
    if (space - nextSize <= 0) {
      wrap.appendChild(span("etc", "…")).addEventListener("click", () => expandObj(wrap, "array", val))
      break
    }
    space -= nextSize
    wrap.appendChild(next)
  }
  wrap.appendChild(document.createTextNode("]"))
  return wrap
}

function representObj(val, space) {
  let string = typeof val.toString == "function" && val.toString(), m
  if (!string || /^\[object .*\]$/.test(string))
    return representSimpleObj(val, space)
  if (val.call && (m = string.match(/^\s*(function[^(]*\([^)]*\))/)))
    return span("fun", m[1] + "{…}")
  let elt = span("etc", string)
  elt.addEventListener("click", () => expandObj(elt, "obj", val))
  return elt
}

function constructorName(obj) {
  if (!obj.constructor) return null
  let m = String(obj.constructor).match(/^function\s*([^\s(]+)/)
  if (m && m[1] != "Object") return m[1]
}

function hop(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

function representSimpleObj(val, space) {
  space -= 2
  let wrap = document.createElement("span")
  let name = constructorName(val)
  if (name) {
    space -= name.length
    wrap.appendChild(document.createTextNode(name))
  }
  wrap.appendChild(document.createTextNode("{"))
  try {
    let first = true
    for (let prop in val)  {
      if (first) {
        first = false
      } else {
        space -= 2
        wrap.appendChild(document.createTextNode(", "))
      }
      let next = space > 0 && represent(val[prop], space)
      let nextSize = next ? prop.length + 2 + eltSize(next) : 0
      if (space - nextSize <= 0) {
        wrap.appendChild(span("etc", "…")).addEventListener("click", () => expandObj(wrap, "obj", val))
        break
      }
      space -= nextSize
      wrap.appendChild(span("prop", prop + ": "))
      wrap.appendChild(next)
    }
  } catch (e) {
    wrap.appendChild(document.createTextNode("…"))
  }
  wrap.appendChild(document.createTextNode("}"))
  return wrap
}

function expandObj(node, type, val) {
  let wrap = document.createElement("span")
  let opening = type == "array" ? "[" : "{", cname
  if (opening == "{" && (cname = constructorName(val))) opening = cname + " {"
  wrap.appendChild(document.createTextNode(opening))
  let block = wrap.appendChild(document.createElement("div"))
  block.className = "sandbox-output-etc-block"
  let table = block.appendChild(document.createElement("table"))
  function addProp(name) {
    let row = table.appendChild(document.createElement("tr"))
    row.appendChild(document.createElement("td")).appendChild(span("prop", name + ":"))
    row.appendChild(document.createElement("td")).appendChild(represent(val[name], 40))
  }
  if (type == "array") {
    for (let i = 0; i < val.length; ++i) addProp(i)
  } else {
    for (let prop in val)  addProp(prop)
  }
  wrap.appendChild(document.createTextNode(type == "array" ? "]" : "}"))
  node.parentNode.replaceChild(wrap, node)
}
})
