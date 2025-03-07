import URLParams from "./URLParams.js";

(() => {

    let theme = localStorage.getItem('theme');
    
    if(!theme){
    
        theme = URLParams.params.theme ?? 
            window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

        localStorage.setItem('theme', theme);
            
    }
    
    document.documentElement.setAttribute('data-bs-theme', theme);


    //Listen prefers-color-scheme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    
        const theme = e.matches ? 'dark' : 'light';

        if(!URLParams.params.theme){

            localStorage.setItem('theme', theme);
            
            document.documentElement.setAttribute('data-bs-theme', theme);
        };
    }); 
    
    //Listen URL changes
    URLParams.on((params) => {
    
        if(params.theme){
    
            localStorage.setItem('theme', params.theme);
            
            document.documentElement.setAttribute('data-bs-theme', params.theme);
        }    
    });

    window.THEME = {
        toggleTheme: () => {
    
            const theme = localStorage.getItem('theme') === 'dark' ? 'light' : 'dark';
        
            localStorage.setItem('theme', theme);
    
            console.log(theme);
        
            document.documentElement.setAttribute('data-bs-theme', theme);
        },

        getTheme: () => localStorage.getItem('theme'),

        isDark: () => localStorage.getItem('theme') === 'dark',

        isLight: () => localStorage.getItem('theme') === 'light',
    }

})();
 