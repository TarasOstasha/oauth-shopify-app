<script setup lang="ts">
import TheWelcome from '@/components/TheWelcome.vue'
import HelloWorld from '@/components/HelloWorld.vue'
</script>


<template>
    <main>
        <hr />
        <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="50" height="50" />
        <hr />
        <HelloWorld msg="You did it!" />
        <hr />
        <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1"
                data-bs-toggle="dropdown" aria-expanded="false">
                Dropdown button
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li><a class="dropdown-item" href="#">Action</a></li>
                <li><a class="dropdown-item" href="#">Another action</a></li>
                <li><a class="dropdown-item" href="#">Something else here</a></li>
            </ul>
        </div>
        <TheWelcome />
    </main>
</template>
