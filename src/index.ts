import './assets/css/index.less'
import { Options } from './types'
import { shorturlConfig, backendConfig, externalConfig, targetConfig } from './config'

let subUrl = ''
function copyText(copyStr: string) {
  navigator.clipboard.writeText(copyStr).then(
    () => {
      layui.layer.msg('复制成功~', { icon: 1 })
    },
    () => {
      layui.layer.msg('复制失败, 请手动选择复制', { icon: 2 })
    }
  )
}

function generateSubUrl(data: Options) {
  const backend = data.backend
  let originUrl = data.url
  originUrl = encodeURIComponent(originUrl.replace(/(\n|\r|\n\r)/g, '|'))

  let newSubUrl = `${backend}&url=${originUrl}&target=${data.target}`

  if (data.config) {
    newSubUrl += `&config=${encodeURIComponent(data.config)}`
  }

  if (data.include) {
    newSubUrl += `&include=${encodeURIComponent(data.include)}`
  }

  if (data.exclude) {
    newSubUrl += `&wxclude=${encodeURIComponent(data.exclude)}`
  }

  if (data.name) {
    newSubUrl += `&filename=${encodeURIComponent(data.name)}`
  }

  newSubUrl += `&emoji=${data.emoji || 'false'}&append_type=${data.append_type || 'false'}&append_info=${data.append_info || 'false'}&scv=${data.scv || 'false'}&udp=${data.udp || 'false'}&list=${data.list || 'false'}&sort=${data.sort || 'false'}&fdn=${data.fdn || 'false'}&insert=${data.insert || 'false'}`
  subUrl = newSubUrl
  $('#result').val(subUrl)
  copyText(subUrl)
}

layui.use(['form'], () => {
  const form = layui.form

  let childrenHtml = ''
  targetConfig.forEach((option) => {
    childrenHtml += `<option value="${option.value}">${option.label}</option>`
  })
  $('#targetSelecter').append(childrenHtml)

  childrenHtml = ''
  externalConfig.forEach((group) => {
    let html = ''
    group.options.forEach((option) => {
      html += `<option value="${option.value}">${option.label}</option>`
    })
    childrenHtml += `<optgroup label="${group.label}">${html}</optgroup>`
  })
  $('#configSelecter').append(childrenHtml)

  childrenHtml = ''
  backendConfig.forEach((option) => {
    childrenHtml += `<option value="${option.value}">${option.label}</option>`
  })
  $('#backendSelecter').append(childrenHtml)

  childrenHtml = ''
  shorturlConfig.forEach((option) => {
    childrenHtml += `<option value="${option.value}">${option.label}</option>`
  })
  $('#shorturlSelecter').append(childrenHtml)
  form.render('select', 'optionsForm')

  form.on('submit(generate)', (target: any) => {
    const data = target.field as Options
    generateSubUrl(data)
  })

  $('#generateShort').on('click', async () => {
    if (!subUrl) {
      return layui.layer.msg('未生成新的订阅链接', { icon: 2 })
    }

    const selectedOption = $('#shorturlSelecter option:selected')
    const apiUrl = selectedOption.val()
    const labelText = selectedOption.text().toLowerCase()

    if (!apiUrl || apiUrl === '') {
      return layui.layer.msg('未选择短链配置', { icon: 2 })
    }

    try {
      let result

      if (labelText.includes('myurls')) {
        const postData = {
          longUrl: btoa(subUrl),
          shortKey: ''
        }

        const response = await fetch(apiUrl as string, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          body: new URLSearchParams(postData).toString()
        })

        result = await response.json()

        $('#result-short').val(result.ShortUrl)
      } else if (labelText.includes('shlink')) {
        const apiKey = $('#shortkeyText').val()
        if (!apiKey || apiKey === '') {
          return layui.layer.msg('未填写短链密钥', { icon: 2 })
        }

        const response = await fetch(apiUrl as string, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': apiKey as string
          },
          body: JSON.stringify({
            longUrl: subUrl,
            findIfExists: true
          })
        })

        result = await response.json()

        $('#result-short').val(result.shortUrl)
      } else {
        return layui.layer.msg('不支持的短链配置类型', { icon: 2 })
      }

      subUrl = ''
      $('#result').val(subUrl)
    } catch (error) {
      layui.layer.msg('短链生成失败：' + error, { icon: 2 })
    }
  })

  $('#importToClash').on('click', () => {
    if (!subUrl) {
      return layui.layer.msg('未生成新的订阅链接', { icon: 2 })
    }
    const url = `clash://install-config?url=${encodeURIComponent(subUrl)}`
    window.open(url)
  })
})
