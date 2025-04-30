export default {
  methods: {

    rgbaToHex (rgba) {
      if (rgba.indexOf('#') < 0) {
        let sep = rgba.indexOf(',') > -1 ? ',' : ' '
        rgba = rgba.substr(5).split(')')[0].split(sep)

        if (rgba.indexOf('/') > -1) {
          rgba.splice(3, 1)
        }

        for (let R in rgba) {
          let r = rgba[R]
          if (r.indexOf('%') > -1) {
            let p = r.substr(0, r.length - 1) / 100

            if (R < 3) {
              rgba[R] = Math.round(p * 255)
            } else {
              rgba[R] = p
            }
          }
        }

        let r = (+rgba[0]).toString(16)
        let g = (+rgba[1]).toString(16)
        let b = (+rgba[2]).toString(16)
        let a = Math.round(+rgba[3] * 255).toString(16)

        if (r.length === 1) {
          r = '0' + r
        }
        if (g.length === 1) {
          g = '0' + g
        }
        if (b.length === 1) {
          b = '0' + b
        }
        if (a.length === 1) {
          a = '0' + a
        }

        return '#' + r + g + b + a
      }

      return rgba
    },

    oppositeColor (bgrColor) {
      let color = this.rgbaToHex(bgrColor)
      color = color.substring(1).slice(0, 6)
      color = parseInt(color, 16)
      color = 0xFFFFFF ^ color
      color = color.toString(16)
      color = ('000000' + color).slice(-6)
      color = '#' + color
      return color
    },

    colorTransparency (color, opacity = 1) {
      if (color.indexOf('rgba') > -1) {
        color = color.substr(5).split(')')[0].split(',')
        let colorObject = {
          r: color[0].replace(' ', ''),
          g: color[1].replace(' ', ''),
          b: color[2].replace(' ', ''),
          a: opacity !== 1 ? opacity : color[3].replace(' ', '')
        }

        return `rgba(${colorObject.r}, ${colorObject.g}, ${colorObject.b}, ${colorObject.a})`
      }

      if (color.indexOf('#') > -1) {
        color = color.substr(1)
        let colorArray = []
        for (let i = 0; i < (color.length / 2); i++) {
          let a = color.substring(i * 2, (i + 1) * 2)
          a = parseInt(a, 16)
          colorArray.push(a)
        }

        return `rgba(${colorArray[0]}, ${colorArray[1]}, ${colorArray[2]}, ${opacity})`
      }

      return color
    },

    lightenDarkenColor (color, amt) {
      if (color.indexOf('#') > -1) {
        color = color.slice(1)

        let num = parseInt(color, 16)

        let r = (num >> 16) + amt

        if (r > 255) r = 255
        else if (r < 0) r = 0

        let g = ((num >> 8) & 0x00FF) + amt

        if (g > 255) g = 255
        else if (g < 0) g = 0

        let b = (num & 0x0000FF) + amt

        if (b > 255) b = 255
        else if (b < 0) b = 0

        return `rgba(${r}, ${g}, ${b}, 1)`
      }

      if (color.indexOf('rgba') > -1) {
        color = color
          .substr(5)
          .split(')')[0]
          .split(',')
          .map((elm, index) => {
            if (index < 3) {
              let a = parseInt(elm) + amt
              if (a > 255) return 255
              else if (a < 0) return 0
              return a
            } else {
              return Number(elm)
            }
          })

        return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`
      }
    }
  }
}
