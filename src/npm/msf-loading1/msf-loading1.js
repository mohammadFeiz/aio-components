export default function MSFLoading1(props = {}){
    let {srcs,style,className} = props;
    let p = {alt:'',className:'msfloadingitem1'};
    return (
      <div className={'msfloading1' + (className?' ' + className:'')} style={{display:'flex',alignItems:'center',justifyContent:'center',...style}}>
        {
          srcs.map((src,i)=>{
            return (<img key={i} src={src} {...p}/>)
          })
        }
      </div>
    )
  }
  