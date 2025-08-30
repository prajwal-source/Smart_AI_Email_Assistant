console.log("Hello Testing");
function findComposeToolbar() {
    const selectors = [
        '.btC',
        '.aDh', 
        '[role="dialog"] .gU.Up'
    ];
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar && toolbar.nodeType === 1) { // 1 = ELEMENT_NODE
            return toolbar;
        }
    }
    return null;
}

function createAIButton(){
    const button=document.createElement('div');
    button.className="T-I J-J5-Ji aoO v7 T-I-atl L3";
    button.style.marginRight='8px';
    button.innerHTML='AI replay';
    button.setAttribute('role','button');
    button.setAttribute('data-tooltip','Generate AI Reply');
    return button;

}
function getEmailContent(){
    const selectors=[
        '.h7',
        '.a3s.aiL',
        '.email_quote',
        'role=["prsentation"]'
    ];
     for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) { // 1 = ELEMENT_NODE
            return content.innerText.trim();
        }
    }
    return '';
}
function injectButton(){
  const existingButton=document.querySelector('ai-reply-button');
  if(existingButton){
    existingButton.remove();
  }
  const toolbar=findComposeToolbar();
  if(!toolbar){
    console.log("Toolbar not found");
    return ;
    
  }
  console.log("Toolbar found");
  const button=createAIButton();
  button.classList.add('ai-reply-button');
//   toolbar.insertBefore(button,toolbar.firstChild)

   button.addEventListener('click',async () => {
    try {
        button.innerHTML='Generating...';
        button.disabled=true;
        const emailContent=getEmailContent();

        const response=await fetch('http://localhost:8080/api/email/generate',{
            method:"POST",
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({
                emailContent:emailContent,
                tone:"professional"
            })
        });
        if(!response.ok){
            throw new Error("Api request failed");
            
        }
        const generatedReply=await response.text();
        const composeBox=document.querySelector(
            '[role="textbox"][g_editable="true"]'
        )
        if(composeBox){
            composeBox.focus();
            // Document.execCommand('insertText',false,generatedReply)
            document.execCommand('insertText',false,generatedReply)
        }

    } catch (error) {
        console.log(error);
        
    }
    finally{
        button.innerHTML='AI Reply'
        button.disabled=false;
    }
   })
   toolbar.insertBefore(button,toolbar.firstChild);
  
}
const observer=new MutationObserver((mutations)=>{
   for(const mutation of mutations){
    const addedNodes=Array.from(mutation.addedNodes);
    const hasComposeElement=addedNodes.some(node=>
        node.nodeType===Node.ELEMENT_NODE &&
        (node.matches('aDh,.btC,[role="dialog"]')
    || node.querySelector('aDh,.btC,[role="dialog"]'))
    );
    if(hasComposeElement){
        console.log("Compose elements are detected");
        setTimeout(injectButton,500);
    }
   }
});
observer.observe(document.body,{
  childList:true,
  subtree:true
})