import React from 'react'

interface MyComponentProps {
  customStyle?: React.CSSProperties // 定义一个可选的props，类型为CSSProperties
}
const MyAd: React.FC<MyComponentProps> = ({ customStyle }) => {
  return (
    <>
      <div className="my-ad">
        <a href="https://github.com/liyupi/yulegeyu" target="_blank">
          <div style={{
            ...customStyle,
            background: 'rgba(0, 0, 0, 0.8)',
            padding: '12px',
          }}
          >
            代码完全开源，欢迎 star
          </div>
        </a>
      </div>
    </>
  )
}

export default MyAd
