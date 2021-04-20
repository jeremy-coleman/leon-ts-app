import React, { useRef, useEffect, useState } from 'react'
import './index.less'

const getSubwayCity = (cityname: string) => {
  const { BMapSub }: any = window
  const list = BMapSub.SubwayCitiesList
  let subwaycity: any = null
  for (var i = 0; i < list.length; i++) {
    if (list[i].name === cityname) {
      subwaycity = list[i]
      break
    }
  }
  return subwaycity
}

const Subway = () => {
  const { BMapSub }: any = window
  const mapRef = useRef<any>()
  const markerRef = useRef<any>()
  const wrapperRef = useRef<any>()
  const [fromto, setFromto] = useState({
    from: '',
    to: '',
  })

  useEffect(() => {
    const subwaycity = getSubwayCity('上海')
    const subway = new BMapSub.Subway('subway', subwaycity.citycode)
    subway.addControl({
      offset: new BMapSub.Size(10, 100),
    })
    subway.setZoom(0.5)
    subway.setCenter('静安寺')
    mapRef.current = subway
  }, [])

  const setMark = (name) => {
    const startIcon = new BMapSub.Icon(
      'https://api.map.baidu.com/images/subway/start-bak.png',
      new BMapSub.Size(50, 80)
    )
    const marker = new BMapSub.Marker(name, { icon: startIcon })
    mapRef.current.addMarker(marker)
    // mapRef.current.setCenter(name)
    // mapRef.current.setZoom(0.5)
    markerRef.current = marker
  }

  useEffect(() => {
    const { from, to } = fromto
    mapRef.current.addEventListener('tap', function handler(e) {
      const { name } = e.station
      if (from && to) {
        // 设置起点
        setFromto({
          from: name,
          to: '',
        })
        setMark(name)
      } else if (from) {
        // 设置终点
        setFromto({
          ...fromto,
          to: name,
        })
        mapRef.current.removeMarker(markerRef.current)
      } else {
        // 设置起点
        setFromto({
          ...fromto,
          from: name,
        })
        setMark(name)
      }
      mapRef.current.removeEventListener('tap', handler)
    })

    if (from && to) {
      const drct = new BMapSub.Direction(mapRef.current)
      drct.search(from, to)
    }
  }, [fromto])

  useEffect(() => {
    function onMouseWheel(e) {
      const scale = e.wheelDelta / 300
      const factor = Math.pow(1.1, scale)
      mapRef.current.setZoom(mapRef.current.getZoom() * factor)
      e.preventDefault()
    }
    wrapperRef.current.addEventListener('wheel', onMouseWheel)
    return () => {
      wrapperRef.current.removeEventListener('wheel', onMouseWheel)
    }
  }, [])

  return (
    <div className="subway-wrapper" ref={wrapperRef}>
      <div id="subway" />
    </div>
  )
}

export default Subway
