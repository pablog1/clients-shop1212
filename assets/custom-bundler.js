function ready(callbackFunc) {
    if (document.readyState !== 'loading') {
      // Document is already ready, call the callback directly
      callbackFunc();
    } else if (document.addEventListener) {
      // All modern browsers to register DOMContentLoaded
      document.addEventListener('DOMContentLoaded', callbackFunc);
    } else {
      // Old IE browsers
      document.attachEvent('onreadystatechange', function() {
        if (document.readyState === 'complete') {
          callbackFunc();
        }
      });
    }
  }
  
  ready(function() {
    
    console.log('control cc');
    let setChoice;
    let container = document.querySelector(".custom-bundler__pdp");
      
      container.addEventListener("click", (ev) => {
        console.log('click');
        
        if (ev.target.classList.contains("choice")) { // click a variant
          // select options
          let type = ev.target.dataset.choice_type;
          let choice = ev.target.dataset.choice;
          let variants = ev.target.closest('.variants');    
  
          let links = variants.querySelectorAll(".choice." + type);
          [...links].forEach((x) => x.classList.remove("active"));        
          ev.target.classList.add("active");
          
          //get options
          let size = variants.querySelector(".choice.Size.active").innerHTML;
          let color = variants.querySelector(".choice.Color.active").innerHTML;
          
          // console.log('choices =  ' + size + ' - ' + color);
          
          //write options
          let combinedOptions = variants.querySelector('.combined-options');
          let combinedOptionsTitle = color + ' / ' + size;
          combinedOptions.dataset.comb_options = combinedOptionsTitle;
          
          //select from the variantsId list, the element with the same title value
          let variantAttrs = variants.querySelector("[data-title='" + combinedOptionsTitle + "']");
          let variantId = variantAttrs.dataset.value;
          
          console.log(variantId);
          
          //set selected variantId  
          let selectedVariantEle = variants.querySelector('.selected-variant-id');
          selectedVariantEle.dataset.variant_id = variantId;
          
        }
        
   
  
        
      });
    
    
    
    
  });
  