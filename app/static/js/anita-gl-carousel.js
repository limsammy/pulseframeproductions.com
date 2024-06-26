/**
 * Author: Shadow Themes
 * Author URL: https://shadow-themes.com
 */
"use strict";

class Anita_GL_Carousel {
  constructor(d, e = !1) {
    if (
      (d instanceof jQuery ? (this.$el = d) : (this.$el = jQuery(d)),
      !this.$el.length)
    )
      return console.warn("gl_Carousel: Element not found"), !1;
    if (!this.$el.children("div").length)
      return console.warn("gl_Carousel: There are no slides"), !1;
    if ("object" != typeof THREE)
      return console.warn("gl_Carousel: Three.js not found"), !1;
    if (
      ((this.options = {
        container: jQuery("body"),
        size: 0.75,
        antialised: !0,
        spacing: 40,
        camera_angle: 0.1,
        camera_move: [0.5, 0.3],
        camera_height: 1.6,
        responsive: !1,
        slideSpeed: 0.04,
        cameraRotateSpeed: 0.025,
        cameraMoveSpeed: 0.02,
        nav: !1,
        wheelSensitive: 50,
        reflection_q: 0.25,
      }),
      e)
    )
      for (let [f, g] of Object.entries(e)) this.options[f] = g;
    let a = this;
    (this.loader = new THREE.TextureLoader()),
      (this.clock = new THREE.Clock()),
      (this.prevTime = 0),
      this.$el.css("transform", "translateX(0px)"),
      (this.shv = 3.8366),
      (this.p2p = (2 * this.shv) / window.innerHeight),
      (this.spacing = this.options.spacing * this.p2p),
      (this.position = {
        gallery_t: 0,
        camera_tR: { x: 0, y: 0, z: 0 },
        camera_tM: { x: 0, y: a.options.camera_height, z: 5, offsetX: 0 },
        text_c: 0,
        text_t: 0,
      }),
      (this.dimension = { slideWidth: 0 }),
      (this.cameraFixed = !1),
      (this.isPortrait = !(window.innerWidth > window.innerHeight)),
      (this.view_pos = { def: 0, zoom: 0 }),
      (this.camera_distance = { land_n: 5, land_z: 4, port_n: 7.5, port_z: 6 }),
      (this.scene = new THREE.Scene()),
      this.isPortrait
        ? (this.view_pos = {
            def: this.camera_distance.port_n,
            zoom: this.camera_distance.port_z,
          })
        : (this.view_pos = {
            def: this.camera_distance.land_n,
            zoom: this.camera_distance.land_z,
          }),
      (this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.5,
        1e3
      )),
      (this.camera.position.z = this.view_pos.def),
      (this.camera.position.y = a.options.camera_height),
      (this.camera.rotation.y = -0.1),
      (this.camera.rotation.x = -0.1),
      jQuery(".anita-gl-carousel-canvas").length &&
        jQuery(".anita-gl-carousel-canvas").remove(),
      (this.renderer = new THREE.WebGLRenderer({
        antialias: a.options.antialised,
        alpha: !1,
      })),
      this.renderer.setSize(window.innerWidth, window.innerHeight),
      this.options.container[0].append(this.renderer.domElement),
      jQuery(this.renderer.domElement).addClass("anita-gl-carousel-canvas");
    let b = new THREE.TextureLoader().load("static/img/ground.jpg"),
      c = { x: 16, y: 8 };
    (b.wrapS = b.wrapT = THREE.RepeatWrapping),
      b.repeat.set(c.x, c.y),
      (this.ground = new THREE.Reflector(new THREE.PlaneGeometry(40, 20), {
        clipBias: 0.03,
        textureWidth: window.innerWidth * a.options.reflection_q,
        textureHeight: window.innerHeight * a.options.reflection_q,
        color: 8421504,
        shader: {
          uniforms: {
            color: { value: null },
            tDiffuse: { value: null },
            textureMatrix: { value: null },
            baseColor: { value: new THREE.Color(0) },
            tNormal: { value: b },
            tRough: { value: b },
            tSize: { value: new THREE.Vector2(1024, 1024) },
            repeat: { value: new THREE.Vector2(c.x, c.y) },
            roughness: { value: 2 },
            blurSize: { value: 8 },
            blurDir: { value: 16 },
            blurQ: { value: 4 },
            mixP: { value: 0.5 },
          },
          vertexShader: `uniform mat4 textureMatrix;varying vec4 vUv;varying vec2 v_texCoord;void main(){vUv=textureMatrix*vec4(position,1.0);v_texCoord=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
          fragmentShader: `uniform vec3 color;uniform vec3 baseColor;uniform sampler2D tDiffuse;uniform sampler2D tRough;uniform sampler2D tNormal;uniform vec2 tSize;uniform vec2 repeat;uniform float roughness;uniform float blurSize;uniform float blurDir;uniform float blurQ;uniform float mixP;varying vec4 vUv;varying vec2 v_texCoord;float bof(float base,float blend){return(base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend)));}vec3 bo(vec3 base,vec3 blend){return vec3(bof(base.r,blend.r),bof(base.g,blend.g),bof(base.b,blend.b));}vec4 gB( sampler2D image,vec2 uv,vec2 resolution,float dir,float quality,float size){float Pi=6.28318530718;vec4 color;vec2 radius=size/resolution.xy;for(float d=0.0;d<Pi;d+=Pi/dir){for(float i=1.0/quality;i<= 1.0;i+=1.0/quality){color+=texture2D(image,uv+vec2(cos(d),sin(d))*radius*i);}}color/=quality*dir-15.0;return color;}void main(){vec4 s=vec4(0.0);vec2 ruv=vec2(v_texCoord*repeat);vec2 up2d=vec2(vUv.s/vUv.q,vUv.t/vUv.q);vec4 nT=texture2D(tNormal,ruv);float nP=0.05;float nX=nT.r*2.0-1.0;float nY=nT.g*2.0-1.0;up2d.x+=nX*nP;up2d.y+=nY*nP;vec4 rT=texture2D(tRough,ruv);float r_blur=blurSize*rT.b*roughness;vec4 rColor=gB(tDiffuse,up2d,tSize,blurDir,blurQ,r_blur);s=vec4(mix(baseColor,rColor.rgb,mixP),1.0);vec4 result = vec4(bo(s.rgb,color),1.0);gl_FragColor=result;}`,
        },
      })),
      (this.ground.rotation.x = -0.5 * Math.PI);
    let h = 0;
    (this.gallery = new THREE.Group()),
      this.$el.children("div").each(function () {
        let c = jQuery(this),
          d = c.attr("data-size").split("x"),
          i = parseFloat(parseInt(d[0], 10) / parseInt(d[1], 10)).toFixed(3),
          b = a.getImageSize(i),
          f;
        if (c.hasClass("is-video")) {
          let g = jQuery(
            '<video src="' +
              c.attr("data-src") +
              '" webkit-playsinline="true" playsinline="true" muted false loop/>'
          );
          c.append(g), (f = new THREE.VideoTexture(g[0]));
        } else f = a.loader.load(c.attr("data-src"));
        let e = new THREE.Mesh(
          new THREE.PlaneGeometry(b[0], b[1]),
          new THREE.ShaderMaterial({
            uniforms: {
              time: { value: 1 },
              tDiffuse: { value: f },
              resolution: { value: new THREE.Vector2(d[0], d[1]) },
              fadeLevel: { value: 0.5 },
            },
            vertexShader: `varying vec2 v_texCoord;void main(){v_texCoord=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
            fragmentShader: `uniform vec2 resolution;uniform sampler2D tDiffuse;uniform float fadeLevel;varying vec2 v_texCoord;void main(){vec4 color=vec4(mix(texture2D(tDiffuse,v_texCoord).rgb,vec3(0.0,0.0,0.0),1.0-fadeLevel),1.0);gl_FragColor=color;}`,
          })
        );
        0 === h ? (h = 0) : (h += 0.5 * parseFloat(b[0])),
          (e.position.y = 0.5 * parseFloat(b[1]).toFixed(3)),
          (e.position.x = h),
          a.gallery.add(e),
          (h += 0.5 * parseFloat(b[0]) + parseFloat(a.spacing)),
          (e.width = parseFloat(b[0]) + parseFloat(a.spacing));
      }),
      this.scene.add(this.ground),
      this.scene.add(this.gallery),
      (this.active = 0),
      (this.max = this.gallery.children.length - 1),
      this.$el.children("div").eq(this.active).addClass("is-active"),
      (this.moveEvent = {
        active: !1,
        point: 0,
        path: 0,
        fullPath: 0,
        moved: !1,
        f_Start: function (b) {
          jQuery(b.target).is("a.anita-gallery-nav")
            ? (a.moveEvent.active = !1)
            : a.moveEvent.active ||
              ((a.moveEvent.active = !0),
              b.touches
                ? (a.moveEvent.point = b.touches[0].clientX)
                : ((a.moveEvent.point = b.clientX),
                  a.$el.parent().addClass("is-grabbed")));
        },
        f_Move: function (b) {
          if ((b.preventDefault(), a.moveEvent.active)) {
            if (
              (b.touches
                ? ((a.moveEvent.path =
                    0.5 * (a.moveEvent.point - b.touches[0].clientX)),
                  (a.moveEvent.point = b.touches[0].clientX))
                : ((a.moveEvent.path = 0.5 * (a.moveEvent.point - b.clientX)),
                  (a.moveEvent.point = b.clientX)),
              a.isPortrait
                ? (a.gallery.position.x -= a.moveEvent.path * a.p2p * 2)
                : (a.gallery.position.x -= a.moveEvent.path * a.p2p),
              (a.moveEvent.fullPath += a.moveEvent.path),
              (a.position.text_c -= a.moveEvent.path),
              a.gallery.position.x > a.gallery.children[0].position.x ||
                a.gallery.position.x <
                  -1 * a.gallery.children[a.max].position.x)
            ) {
              if (
                a.gallery.position.x > a.gallery.children[0].position.x &&
                a.moveEvent.path < 0
              ) {
                let c =
                  (a.gallery.position.x - a.gallery.children[0].position.x) /
                  (0.25 * window.innerWidth * a.p2p);
                a.isPortrait && (c *= 2),
                  (a.gallery.position.x += a.moveEvent.path * a.p2p * c),
                  (a.position.text_c += a.moveEvent.path);
              }
              if (
                a.gallery.position.x <
                  -1 * a.gallery.children[a.max].position.x &&
                a.moveEvent.path > 0
              ) {
                let d =
                  (-1 * a.gallery.children[a.max].position.x -
                    a.gallery.position.x) /
                  (0.25 * window.innerWidth * a.p2p);
                a.isPortrait && (d *= 2),
                  (a.gallery.position.x += a.moveEvent.path * a.p2p * d),
                  (a.position.text_c += a.moveEvent.path);
              }
            }
            a.$el.css("transform", "translateX(" + a.position.text_c + "px)");
          }
        },
        f_End: function () {
          if (Math.abs(a.moveEvent.fullPath) > 50) {
            let b =
              a.gallery.position.x + a.gallery.children[a.active].position.x;
            b < -1 ? a.nextSlide() : b > 1 && a.prevSlide();
          }
          (a.moveEvent.active = !1),
            (a.moveEvent.point = 0),
            (a.moveEvent.path = 0),
            (a.moveEvent.fullPath = 0),
            a.$el.parent().removeClass("is-grabbed");
        },
      }),
      jQuery(window).on("resize", function () {
        a.layout();
      }),
      (this.isTouch = !1),
      this.$el
        .on("mouseenter", "a", function () {
          a.cameraFixed = !0;
        })
        .on("mouseleave", "a", function () {
          a.cameraFixed = !1;
        }),
      jQuery(document)
        .on("mousemove", function (b) {
          if (!a.isTouch && !a.cameraFixed) {
            let c =
                parseFloat(b.pageX - 0.5 * window.innerWidth) /
                (0.5 * window.innerWidth).toFixed(3),
              d =
                parseFloat(b.pageY - 0.5 * window.innerHeight) /
                (0.5 * window.innerHeight).toFixed(3);
            (a.position.camera_tM.offsetX = a.options.camera_move[0] * c),
              (a.position.camera_tM.y =
                a.options.camera_height - a.options.camera_move[1] * d);
          }
        })
        .on("mouseleave", function () {
          a.position.camera_tM.y = a.options.camera_height;
        }),
      this.$el.parent().on("mousedown", function (b) {
        a.isTouch || a.moveEvent.f_Start(b);
      }),
      this.$el.parent().on("mousemove", function (b) {
        a.isTouch || a.moveEvent.f_Move(b);
      }),
      this.$el.parent().on("mouseup", function (b) {
        a.moveEvent.f_End();
      }),
      this.$el.parent().on("mouseleave", function (b) {
        a.moveEvent.f_End();
      }),
      (this.wheelTime = 0),
      this.$el.parent()[0].addEventListener("wheel", function (b) {
        b.timeStamp - a.wheelTime > a.options.wheelSensitive
          ? (b.deltaX > 0 && a.prevSlide(),
            b.deltaX < 0 && a.nextSlide(),
            b.deltaY > 0 && a.nextSlide(),
            b.deltaY < 0 && a.prevSlide())
          : b.preventDefault(),
          (a.wheelTime = b.timeStamp);
      }),
      this.$el.parent().on("touchstart", function (b) {
        (a.isTouch = !0), a.moveEvent.f_Start(b);
      }),
      this.$el.parent().on("touchmove", function (b) {
        a.moveEvent.f_Move(b);
      }),
      this.$el.parent().on("touchend", function () {
        a.moveEvent.f_End();
      }),
      jQuery(document).on("keyup", function (b) {
        37 == b.keyCode && a.prevSlide(),
          39 == b.keyCode && a.nextSlide(),
          13 == b.keyCode &&
            a.$el
              .children()
              .eq(a.active)
              .children()
              .children("a")
              .trigger("click"),
          32 == b.keyCode &&
            (a.cameraFixed ? (a.cameraFixed = !1) : (a.cameraFixed = !0));
      }),
      this.$el.on("click", ".anita-album-link", function () {
        window.localStorage.setItem("anita_listing_index", a.active);
      }),
      this.options.nav &&
        ((this.ui = {
          prev: jQuery(
            '<a href="javascript:void(0)" class="anita-gallery-nav anita-gallery-nav__prev">' +
              (a.$el.attr("data-prev-label")
                ? "<span>" + a.$el.attr("data-prev-label") + "</span>"
                : "") +
              "</a>"
          ),
          next: jQuery(
            '<a href="javascript:void(0)" class="anita-gallery-nav anita-gallery-nav__next">' +
              (a.$el.attr("data-next-label")
                ? "<span>" + a.$el.attr("data-next-label") + "</span>"
                : "") +
              "</a>"
          ),
        }),
        this.$el.after(this.ui.next).after(this.ui.prev),
        this.ui.prev.on("click", function () {
          a.prevSlide();
        }),
        this.ui.next.on("click", function () {
          a.nextSlide();
        })),
      a.layout(),
      this.$el.parent().hasClass("anita-albums-listing") &&
        null !== window.localStorage.getItem("anita_back_from_album") &&
        null !== window.localStorage.getItem("anita_listing_index") &&
        (!0 ==
          JSON.parse(window.localStorage.getItem("anita_back_from_album")) &&
          ((this.active = parseInt(
            JSON.parse(window.localStorage.getItem("anita_listing_index")),
            10
          )),
          (this.position.gallery_t = this.gallery.position.x =
            -1 * this.gallery.children[this.active].position.x),
          (this.position.text_t = this.position.text_c =
            -1 * this.active * this.dimension.slideWidth),
          this.$el.css(
            "transform",
            "translateX(" + this.position.text_c + "px)"
          )),
        window.localStorage.setItem("anita_back_from_album", !1),
        window.localStorage.setItem("anita_listing_index", "0")),
      this.changeSlide(),
      this.$el.parent().addClass("is-loaded"),
      setTimeout(
        function () {
          jQuery(a.renderer.domElement).addClass("is-loaded");
        },
        100,
        a
      ),
      (this.anim = requestAnimationFrame(() => this.animate()));
  }
  prevSlide() {
    (this.active -= 1),
      this.active < 0 && (this.active = 0),
      this.changeSlide();
  }
  nextSlide() {
    (this.active += 1),
      this.active > this.max && (this.active = this.max),
      this.changeSlide();
  }
  changeSlide() {
    this.$el.children(".is-active").children("video").length &&
      this.$el.children(".is-active").children("video")[0].pause(),
      this.$el.children(".is-active").removeClass("is-active"),
      this.$el.children("div").eq(this.active).addClass("is-active"),
      this.$el.children(".is-active").children("video").length &&
        this.$el.children(".is-active").children("video")[0].play(),
      (this.position.text_t = -1 * this.active * this.dimension.slideWidth),
      (this.position.gallery_t =
        -1 * this.gallery.children[this.active].position.x);
    let a = (this.active / this.max) * 2 - 1;
    (this.position.camera_tR.y = this.options.camera_angle * a),
      (this.position.camera_tM.x = 0.95 * a),
      this.options.nav &&
        (0 == this.active
          ? this.ui.prev.addClass("is-disabled")
          : this.ui.prev.removeClass("is-disabled"),
        this.active == this.max
          ? this.ui.next.addClass("is-disabled")
          : this.ui.next.removeClass("is-disabled"));
  }
  layout() {
    let a = window.innerWidth,
      b = window.innerHeight;
    (this.isPortrait = !(a > b)),
      this.isPortrait
        ? (this.view_pos = {
            def: this.camera_distance.port_n,
            zoom: this.camera_distance.port_z,
          })
        : (this.view_pos = {
            def: this.camera_distance.land_n,
            zoom: this.camera_distance.land_z,
          }),
      this.renderer.setSize(a, b),
      (this.camera.aspect = a / b),
      this.camera.updateProjectionMatrix(),
      (this.p2p = (2 * this.shv) / window.innerHeight),
      (this.spacing = this.options.spacing * this.p2p),
      (this.dimension.slideWidth = this.$el.children().width()),
      this.changeSlide();
  }
  getImageSize(a = 1) {
    a = parseFloat(a).toFixed(3);
    let b = parseFloat(2 * this.shv * this.options.size).toFixed(3);
    return [parseFloat(b * a).toFixed(3), b];
  }
  animate() {
    "undefined" != typeof stats && stats.begin();
    let b = this;
    this.anim = requestAnimationFrame(() => this.animate());
    let c = this.clock.getElapsedTime(),
      a = c - this.prevTime;
    if (
      ((this.prevTime = c),
      b.moveEvent.active ||
        (this.gallery.position.x +=
          (this.position.gallery_t - this.gallery.position.x) * 2 * a),
      this.cameraFixed
        ? ((this.camera.rotation.x += (0.07 - this.camera.rotation.x) * a),
          (this.camera.rotation.y += (0 - this.camera.rotation.y) * a),
          (this.camera.rotation.z = 0))
        : ((this.camera.rotation.x +=
            (this.position.camera_tR.x - this.camera.rotation.x) * a),
          (this.camera.rotation.y +=
            (this.position.camera_tR.y - this.camera.rotation.y) * a),
          (this.camera.rotation.z = 0),
          this.camera.rotation.x > 0.07
            ? (this.camera.rotation.x = 0.07)
            : this.camera.rotation.x < -0.1 && (this.camera.rotation.x = -0.1),
          this.camera.rotation.y > this.options.camera_angle
            ? (this.camera.rotation.y = this.options.camera_angle)
            : this.camera.rotation.y < -1 * this.options.camera_angle &&
              (this.camera.rotation.y = -1 * this.options.camera_angle)),
      this.cameraFixed
        ? ((this.camera.position.x += (0 - this.camera.position.x) * a),
          (this.camera.position.y += (2.4 - this.camera.position.y) * a),
          (this.camera.position.z +=
            (this.view_pos.zoom - this.camera.position.z) * a))
        : jQuery("body").hasClass("anita-show-menu")
        ? ((this.camera.position.x +=
            (this.position.camera_tM.x +
              b.position.camera_tM.offsetX -
              this.camera.position.x) *
            a),
          (this.camera.position.y +=
            (this.position.camera_tM.y - this.camera.position.y) * a),
          (this.camera.position.z +=
            (this.view_pos.zoom - this.camera.position.z) * a * 2))
        : ((this.camera.position.x +=
            (this.position.camera_tM.x +
              b.position.camera_tM.offsetX -
              this.camera.position.x) *
            a),
          (this.camera.position.y +=
            (this.position.camera_tM.y - this.camera.position.y) * a),
          (this.camera.position.z +=
            (this.view_pos.def - this.camera.position.z) * a),
          this.camera.position.y > 2.4
            ? (this.camera.position.y =
                this.options.camera_move[1] + this.options.camera_height)
            : this.camera.position.y <
                this.options.camera_height - this.options.camera_move[1] &&
              (this.camera.position.y =
                this.options.camera_height - this.options.camera_move[1]),
          this.camera.position.z > this.camera_distance.port_n
            ? (this.camera.position.z = this.camera_distance.port_n)
            : this.camera.position.z < this.camera_distance.land_z &&
              (this.camera.position.z = this.camera_distance.land_z)),
      jQuery(this.gallery.children).each(function (a) {
        a !== b.active &&
          this.material.uniforms.fadeLevel.value > 0.3 &&
          (this.material.uniforms.fadeLevel.value -=
            (this.material.uniforms.fadeLevel.value - 0.3) * 0.05);
      }),
      this.gallery.children[this.active].material.uniforms.fadeLevel.value <
        1 &&
        (this.gallery.children[this.active].material.uniforms.fadeLevel.value +=
          (1 -
            this.gallery.children[this.active].material.uniforms.fadeLevel
              .value) *
          0.05),
      !b.moveEvent.active)
    ) {
      let d = this.position.text_t - this.position.text_c,
        e = this.position.text_c;
      0.01 > Math.abs(d)
        ? (this.position.text_c += 0)
        : (this.position.text_c += 0.03 * d),
        this.position.text_c !== e &&
          this.$el.css(
            "transform",
            "translateX(" + this.position.text_c + "px)"
          );
    }
    this.renderer.render(this.scene, this.camera),
      this.options.debug && stats.end(),
      "undefined" != typeof stats && stats.end();
  }
}
jQuery(".anita-gl-carousel-gallery").length &&
  jQuery.getScript("static/js/lib/three.min.js").done(function () {
    jQuery.getScript("static/js/lib/shaders/reflector.js").done(function () {
      new Anita_GL_Carousel(jQuery(".anita-gl-carousel-gallery"), {
        container: jQuery(".anita-main"),
        nav: !0,
      });
    });
  });
