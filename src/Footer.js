const Footer =({length}) =>{
    
    return(
        <footer>
            <p>{length} {length === 1 ? 'List Item' : 'List Itemss'}  </p>
        </footer>
    )
}


export default Footer
