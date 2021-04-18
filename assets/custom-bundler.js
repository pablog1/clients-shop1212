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
  
  let setChoice;
  let container = document.querySelector(".custom-bundler__pdp");
  
  bundlerSelectionsGrid();
    
    container.addEventListener("click", (ev) => {
      console.log('click');
      
      if (ev.target.classList.contains("choice")) { // click a variant
        
        console.log('click variant');
        // select options
        let type = ev.target.dataset.choice_type;
        let choice = ev.target.dataset.choice;
        let variants = ev.target.closest('.variants');    
        
        let productId = variants.dataset.product_id;

        let links = variants.querySelectorAll(".choice." + type);
        [...links].forEach((x) => x.classList.remove("active"));        
        ev.target.classList.add("active");
        
        //get options
        let size = variants.querySelector(".choice.Size.active").dataset.choice;
        let color = variants.querySelector(".choice.Color.active").dataset.choice;
        
        // console.log('choices =  ' + size + ' - ' + color);
        
        //write options
        let combinedOptions = variants.querySelector('.combined-options');
        let combinedOptionsTitle = color + ' / ' + size;
        combinedOptions.dataset.comb_options = combinedOptionsTitle;
        
        //get from the variantsId list, the element with the same title value
        let variantAttrs = variants.querySelector("[data-title='" + combinedOptionsTitle + "']");
        let variantId = variantAttrs.dataset.value;
        let variantImg = variantAttrs.dataset.img;
        
        console.log(variantId);
        
        //change image if possible
        
        if (type == "Color") {
          let card = ev.target.closest('.custom-bundler__pdp__item').querySelector(".card__img"); 
          card.innerHTML = '<img src="' + variantImg + '" >';
        }
    
        
        // set selected variantId  
        let selectedVariantEle = variants.querySelector('.selected-variant-id');
        selectedVariantEle.dataset.variant_id = variantId;
        
        // set "your selections fileds"
        let yourSelections = document.querySelector('.product-id-' + productId);
        yourSelections.innerHTML =  "<picture class='card__img'><img src='" + variantImg + "'/></picture>";
        
        bundlerSelectionsGrid();
      } // end if click on variant
      
       if (ev.target.classList.contains("add-to-cart")) { // click add to cart
         
         // create json         
         let items = [], data = [];
         let variantIds = container.querySelectorAll("[data-variant_id]");
         [...variantIds].forEach((ele) => {
           data = {
              "id": ele.dataset.variant_id,
              "quantity": 1
           };
           
           items.push(data)
           addItemToCart(items);
          
         });  // end if.. add to cart   
          
           
           console.log('res ', items);
                        
         
         // add to cart
         function addItemToCart(items) {
 
          jQuery.ajax({
            type: 'POST',
            url: '/cart/add.js',
            data: { items: items },
            dataType: 'json',
            success: function() { 
                setTimeout(function() {
                	window.location = '/cart';
              	}, 500)
            }
          });
         }
         
         
         // check minicart behavior...
                  
       } // end click add to cart
      
      
    }); // end click listener
  
  
  	// if it's a PDP, replace colors for images
  	if(container){
    	//for each
      	let imagePlaceHolder = [];
        imagePlaceHolder = container.querySelectorAll(".choice.Color.image");
         [...imagePlaceHolder].forEach((ele) => {
           //search on all-variants
            let allVariants= [];
           	allVariants = container.querySelectorAll(".all-variants [data-value]");
            [...allVariants].forEach((e) => {
              if(e.dataset.title.includes(ele.dataset.choice + ' /')){                
                ele.innerHTML = "<img src='" + e.dataset.img + "' />";
                 }
            });
           
         });
     }
  	
  
  
  function bundlerSelectionsGrid() { 
  
    //read all elements "custom-bundler__pdp__your-selection"
    let bundlerSelections = document.querySelectorAll('.custom-bundler__pdp__items .custom-bundler__pdp__your-selection');
    
    
    //populate the bundlerSelectionsGrid
    let bundlerSelectionsText = '';
    [...bundlerSelections].forEach((e) => {     
      bundlerSelectionsText = bundlerSelectionsText.concat(e.outerHTML);                              
    });
    
    let res = document.querySelector('.all-selections');
     res.innerHTML = '';
    res.innerHTML = bundlerSelectionsText;
  
  }
    
}); // end ready function
