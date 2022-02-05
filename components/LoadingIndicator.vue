<template>
  <div class="la-ball-clip-rotate-pulse opacity-80">
    <div></div>
    <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 660" height="90%" style="padding-top: 8%" class="text-yellow-800 mx-auto">
      <title>paddle</title>
      <g class="paddle">
        <path
          fill="#ff0000"
          d="M504,301.91c-1.58,7.94-2.75,16-4.8,23.79-9.41,36-27.54,67.28-52.62,94.65-14.65,16-30.79,29.62-51.22,38.13-18.73,7.79-36.22,6.86-53.54-3.18-28.09-16.3-56.1-32.73-84.31-48.82-17.79-10.15-35.91-19.71-53.79-29.7a88.57,88.57,0,0,1-12.84-8.57c-8.76-7.14-11.41-16.49-11.58-27.83-.63-42.24,19.8-75.12,45.3-106,23.09-27.94,50.78-49.52,85.77-60.41,43.9-13.66,87-12.47,127.43,11.1,34.67,20.2,56.5,50.46,64.54,90.16.58,2.88,1.11,5.77,1.66,8.66Z"
          transform="translate(-50 -50)"
        />
        <path
          fill="currentColor"
          d="M152,626c-13.63-2.81-24.8-10.38-35.33-18.89-9.25-7.47-10.78-14.35-4.56-24.51,6.33-10.34,13.68-20.09,21-29.8,20.62-27.43,41.5-54.65,62.15-82.06,10.57-14,17.46-29.43,16.68-47.55-.46-10.55-3.64-20.24-8.27-29.58a6.82,6.82,0,0,1-.88-3.88L330.12,462.9l-.06,1c-1.66.08-3.32.13-5,.23-12.44.76-25,.7-37.27,2.59C280.65,467.84,274,472,267.12,475c-1,.45-1.81,1.75-2.5,2.79Q248.3,502.23,232,526.71q-27.09,40.72-54.2,81.46C172.4,616.35,166.19,623.63,156,626Zm47.88-108c-1.88-2.67-3.3-6.62-6.08-8.23A10.47,10.47,0,0,0,180,512.36q-15.8,21.54-31.32,43.27c-4,5.58-2.48,10.81,3.47,14.1,5.69,3.14,11,2.09,15.24-3.71,9.91-13.57,19.62-27.3,29.3-41C197.84,523.28,198.44,521.14,199.87,518Z"
          transform="translate(-50 -50)"
        />
      </g>

      <circle class="ball" style="fill: #fff" cx="270" cy="300" r="36" />
    </svg>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {},
  methods: {},
  mounted() {}
}
</script>

<style scoped>
/*!
 * Load Awesome v1.1.0 (http://github.danielcardoso.net/load-awesome/)
 * Copyright 2015 Daniel Cardoso <@DanielCardoso>
 * Licensed under MIT
 */
.la-ball-clip-rotate-pulse,
.la-ball-clip-rotate-pulse > div {
  position: relative;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
.la-ball-clip-rotate-pulse {
  display: block;
  font-size: 0;
  color: #ffffff44;
}
.la-ball-clip-rotate-pulse > div {
  display: inline-block;
  float: none;
  background-color: currentColor;
  border: 0 solid currentColor;
}
.la-ball-clip-rotate-pulse > div {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 100%;
}
.la-ball-clip-rotate-pulse > div:first-child {
  position: absolute;
  width: 100%;
  height: 100%;
  background: transparent;
  border-style: solid;
  border-width: 4px;
  border-right-color: transparent;
  border-left-color: transparent;
  -webkit-animation: ball-clip-rotate-pulse-rotate 0.9s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
  -moz-animation: ball-clip-rotate-pulse-rotate 0.9s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
  -o-animation: ball-clip-rotate-pulse-rotate 0.9s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
  animation: ball-clip-rotate-pulse-rotate 0.9s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}

/*
 * Animations
 */
@-webkit-keyframes ball-clip-rotate-pulse-rotate {
  0% {
    -webkit-transform: translate(-50%, -50%) rotate(0deg);
    transform: translate(-50%, -50%) rotate(0deg);
  }
  50% {
    -webkit-transform: translate(-50%, -50%) rotate(180deg);
    transform: translate(-50%, -50%) rotate(180deg);
  }
  100% {
    -webkit-transform: translate(-50%, -50%) rotate(360deg);
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
@-moz-keyframes ball-clip-rotate-pulse-rotate {
  0% {
    -moz-transform: translate(-50%, -50%) rotate(0deg);
    transform: translate(-50%, -50%) rotate(0deg);
  }
  50% {
    -moz-transform: translate(-50%, -50%) rotate(180deg);
    transform: translate(-50%, -50%) rotate(180deg);
  }
  100% {
    -moz-transform: translate(-50%, -50%) rotate(360deg);
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
@-o-keyframes ball-clip-rotate-pulse-rotate {
  0% {
    -o-transform: translate(-50%, -50%) rotate(0deg);
    transform: translate(-50%, -50%) rotate(0deg);
  }
  50% {
    -o-transform: translate(-50%, -50%) rotate(180deg);
    transform: translate(-50%, -50%) rotate(180deg);
  }
  100% {
    -o-transform: translate(-50%, -50%) rotate(360deg);
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
@keyframes ball-clip-rotate-pulse-rotate {
  0% {
    -webkit-transform: translate(-50%, -50%) rotate(0deg);
    -moz-transform: translate(-50%, -50%) rotate(0deg);
    -o-transform: translate(-50%, -50%) rotate(0deg);
    transform: translate(-50%, -50%) rotate(0deg);
  }
  50% {
    -webkit-transform: translate(-50%, -50%) rotate(180deg);
    -moz-transform: translate(-50%, -50%) rotate(180deg);
    -o-transform: translate(-50%, -50%) rotate(180deg);
    transform: translate(-50%, -50%) rotate(180deg);
  }
  100% {
    -webkit-transform: translate(-50%, -50%) rotate(360deg);
    -moz-transform: translate(-50%, -50%) rotate(360deg);
    -o-transform: translate(-50%, -50%) rotate(360deg);
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.ball {
  animation: bounce 0.3s infinite alternate;
  animation-timing-function: cubic-bezier(0, 0.5, 0.5, 0.95);
}

@keyframes bounce {
  0% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(-250px);
  }
}

.paddle {
  animation: hit 0.3s infinite alternate;
  animation-timing-function: cubic-bezier(0, 0.5, 0.5, 0.5);
  transform-origin: bottom right;
}

@keyframes hit {
  0% {
    transform: rotateY(0deg) rotateZ(0deg) rotateX(35deg);
  }
  100% {
    transform: rotateY(0deg) rotateZ(0deg) rotateX(38deg);
  }
}
</style>