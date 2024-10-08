// pages/_app.js
import 'primereact/resources/themes/saga-blue/theme.css';  // Theme
import 'primereact/resources/primereact.min.css';          // Core CSS
import 'primeicons/primeicons.css';                        // Icons
import 'primeflex/primeflex.css';                          // PrimeFlex

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp;
