const UNIT = "."
const MAX = 1_000_000

function visualize() {
  const n1 = document.getElementById("n1").value
  const n2 = document.getElementById("n2").value

  let scale = Math.floor(n1 / parseInt(n1.toString()[0])) / 10

  if (n2 < MAX) {
    scale = 1
  }

  printScale(scale)
  printOutput(n1 / scale, n2 / scale)
}

function printOutput(n1, n2) {
  const output = document.getElementById("output")

  output.textContent =
    "0" +
    UNIT.repeat(n1) + "n1" +
    UNIT.repeat(n2) + "n2"
}

function printScale(scale) {
  const scaleOutput = document.getElementById("scale")

  scaleOutput.textContent = `${ UNIT } represets about ${ scale } unit`
}
