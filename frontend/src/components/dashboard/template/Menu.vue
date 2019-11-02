<template>
    <aside class="menu" v-show="isMenuVisible">
     	<nav id="sidebar">
   		<ul class="list-unstyled components">
   			<li>
   			   <router-link to="/">
                <i class="fa fa-tachometer"><span> Dashboard </span></i>
               </router-link>
               </li>
               <li>
   				     <router-link to="/clientes" >
                    <i class="fa fa-user"> <span> Clientes </span> </i> 
                    </router-link>
               </li>
               <li>
   			   	<router-link to="/tickets" >
               <i class="fa fa-phone"> <span> Atendimentos </span> </i> 
              </router-link>
   			</li>
               <li>
   		 		 <router-link to="/softwares" >
                 <i class="fa fa-desktop"><span> Softwares </span></i>
                  </router-link>
   			</li>
   		</ul>
       </nav>
    </aside>
</template>

<script>
import { mapState } from 'vuex'
import { baseApiUrl } from '@/global'
import axios from 'axios'

export default {
    name: 'Menu',
    components: { },
    computed: mapState(['isMenuVisible'])
}
</script>

<style>
.menu {
        grid-area: menu;
         background-color: #222D32;

        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
}

#sidebar {
    min-width: 250px;
    max-width: 250px;
    background: #222D32;
}

#sidebar ul.components{
	padding: 20px 0px;
}

#sidebar ul li a{
	padding: 12px 5px 12px 15px;
    display: block;
    color:#F1F2F2;
    font-size: 1.1rem;
    border-bottom: 1px solid #313638;
   
}

#sidebar ul li a:hover {
    color: rgb(223, 223, 223);
    background: #1E282C;
}
 
span {
    padding-left: 10px;
    text-align: center;
}



</style>
