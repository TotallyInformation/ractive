const defaults = {
  duration: 300,
  easing: 'easeInOut'
}

const props = [
  'height',
  'borderTopWidth',
  'borderBottomWidth',
  'paddingTop',
  'paddingBottom',
  'marginTop',
  'marginBottom'
]

const collapsed = {
  height: 0,
  borderTopWidth: 0,
  borderBottomWidth: 0,
  paddingTop: 0,
  paddingBottom: 0,
  marginTop: 0,
  marginBottom: 0
}

export default function slide (t, params) {
  const options = t.processParams(params, defaults)
  const targetStyle = t.isIntro ? t.getStyle(props) : collapsed

  t.setStyle(t.isIntro ? collapsed : t.getStyle(props))
  t.setStyle('overflowY', 'hidden')

  t.animateStyle(targetStyle, options).then(t.complete)
}