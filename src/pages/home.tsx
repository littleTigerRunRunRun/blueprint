import {} from 'react'
import { Link } from 'react-router-dom'
import './home.scss'
import proto1 from '../assets/prototype_1.png'

function Home() {
  const examples = [{
    label: '蓝图编辑器原型V1-datav+数据格式',
    path: '/prototype?data=data1',
    img: proto1
  }, {
    label: '蓝图编辑器原型V2-数据流和控制流',
    path: '/prototype2?data=data2',
    img: proto1
  }]

  return (
    <>
      <div className="home-header">
        <div className="title">
          <span>星图Starmap</span><br/>
          <span className="title-sub">夜含<b>星</b>斗分乾象，晓映雷云作画<b>图</b>。&nbsp;&nbsp;——白居易《游小洞庭》</span>
        </div>
      </div>
      <div className="home-content">
        {examples.map((block, index) => {
          return <div className="content-block" key={`block_${index}`}>
            <Link to={block.path} className="content-block">
              <img src={proto1} className="image-alternate" />
              <span>{ block.label }</span>
            </Link>
          </div>
        })}
      </div>
    </>
  )
}

export default Home