define(['helpers/shape', 'objects/banana'],
  function ( Shape, Banana ) {
    
    var BODY_COLOR = 'rgb( 255, 170, 82 )',
        BODY_LINE  = 'rgb( 0, 0, 160 )';

    function Gorilla ( context, playerNumber ) {
      this.context = context;
      this.playerNumber = playerNumber;
      this.width = 40;
      this.height = 40;
      this.wins = 0;
      this.dead = false;
      this.animate = false;
      this.directionRight = 'down';
      this.directionLeft = 'up';
      this.animations = 0;
      this.explosionWidth = this.width;
      this.explosionHeight = this.height;
      this.oldY = false;
      this.timer = 0;
      this.justThrown = false;
    }

    /**
     * create: Build the player out
     * Depending on state, hands will be either down or up for throwing
     * else, we display the player as dead.
     */
    Gorilla.prototype.create = function ( x, y ) {

      if ( this.dead ) {
        this.renderDead();
        return;
      }

      this.x = x;

      // We need to keep the Gorillas in the same spot when re-rendering
      if ( !this.oldY ) {
        this.oldY = true;
        this.y = y - 47; // Move the Gorilla up out of the building
      } else {
        this.y = y;
      }

      // Draw the Head
      this.context.fillStyle = BODY_COLOR;
      this.context.fillRect( this.x - 4, this.y,  7, 7 );
      this.context.fillRect( this.x - 5, this.y + 2, 9, 3 );

      // Draw the eyes/brow
      this.context.fillStyle = BODY_LINE;
      this.context.fillRect( this.x - 3, this.y + 2, 5, 1 );
      this.context.fillRect( this.x - 3, this.y + 4, 2, 1 );
      this.context.fillRect( this.x, this.y + 4, 2, 1 );

      // Draw the Neck
      this.context.fillStyle = BODY_COLOR;
      this.context.fillRect( this.x - 3, this.y + 7, 5, 1 );

      // Draw the Body
      this.context.fillRect( this.x - 9, this.y + 8, 17, 7 );
      this.context.fillRect( this.x - 7, this.y + 15, 13, 6 );

      // Draw the Legs
      for ( var i = 0; i < 4; i++ ) {
        this.context.strokeStyle = BODY_COLOR;
        this.context.beginPath();
        // Left Leg
        this.context.arc( this.x + 2 + i, this.y + 25, 10, 3 * Math.PI / 4, 9 * Math.PI / 8, false );
        this.context.stroke();
        this.context.beginPath();
        // Right Leg
        this.context.arc( this.x - 3 - i, this.y + 25, 10, 15 * Math.PI / 8, Math.PI / 4, false );
        this.context.stroke();
      }

      // Draw the Chest
      this.context.strokeStyle = BODY_LINE;
      this.context.beginPath();
      this.context.arc( this.x - 5, this.y + 10, 4.9, 0, 3 * Math.PI / 5, false );
      this.context.stroke();
      this.context.beginPath();
      this.context.arc( this.x + 4, this.y + 10, 4.9, 3 * Math.PI / 7, 4 * Math.PI / 4, false );
      this.context.stroke();

      if ( this.animate ) {
        // DANCE GORILLA DANCE!!!
        if ( this.directionLeft === 'up' ) {
            this.animateArms( 'leftArm', [15, 3 * Math.PI / 4, 5 * Math.PI / 4, false], ( this.directionLeft === 'down' ) ? 'up' : 'down' );
        } else {
            this.animateArms( 'leftArm', [5, 3 * Math.PI / 4, 5 * Math.PI / 4, false], ( this.directionLeft === 'up' ) ? 'down' : 'up' );
        }
        if ( this.directionRight === 'up' ) {
            this.animateArms( 'rightArm', [15, 7 * Math.PI / 4, Math.PI / 4, false], ( this.directionRight === 'down' ) ? 'up' : 'down' );
        } else {
            this.animateArms( 'rightArm', [5, 7 * Math.PI / 4, Math.PI / 4, false], ( this.directionRight === 'up' ) ? 'down' : 'up' );
        }
      } else {
        // Draw the Arms
        for ( var i = -5; i < -1; i++ ) {
          this.context.strokeStyle = BODY_COLOR;
          // Left Arm
          this.context.beginPath();
          this.context.arc( this.x + 1 + i , this.y + 15, 9, 3 * Math.PI / 4, 5 * Math.PI / 4, false );
          this.context.stroke();
          // Right Arm
          this.context.beginPath();
          this.context.arc( this.x - 2 - i , this.y + 15, 9, 7 * Math.PI / 4, Math.PI / 4, false );
          this.context.stroke();
        }
      }
    };

    /**
     * animateArms: If we are dancing, lets pick the right arms to dance with
     */
    Gorilla.prototype.animateArms = function ( arm, arc, direction ) {
      this.context.strokeStyle = BODY_COLOR;
      for ( var i = -5; i < -1; i++ ) {
        if ( arm === 'leftArm' ) {
          this.context.beginPath();
          this.context.arc( this.x + 1 + i , this.y + arc[0], 9, arc[1], arc[2], arc[3] );
          this.context.stroke();
        }
        if ( arm === 'rightArm' ) {
          this.context.beginPath();
          this.context.arc( this.x - 2 - i , this.y + arc[0], 9, arc[1], arc[2], arc[3] );
          this.context.stroke();
        }
      }
      if ( arm === 'leftArm' ) this.directionLeft = direction;
      if ( arm === 'rightArm' ) this.directionRight = direction;
    };

    /**
     * reCreate: Does what it says
     */
    Gorilla.prototype.reCreate = function () {
      this.create( this.x, this.y );
    };

    /**
     * getBanana: create a new banana object
     */
    Gorilla.prototype.getBanana = function ( force, angle, wind ) {
      this.banana = new Banana( this.context, this.x, this.y - 17, force, angle, wind );
    };

    /**
     * renderDead: Draw the Gorilla as dead
     */
    Gorilla.prototype.renderDead = function () {
      this.context.fillStyle = 'rgb( 0, 0, 160 )';
      var shape = new Shape( this.context );
      shape.ellipse( this.x - this.width * 2, this.y, 2.5 * this.explosionWidth, this.explosionHeight );
    };

    /**
     * animateColission: Lets make the player appear to explode
     */
    Gorilla.prototype.animateColission = function () {
      var width, height, shape;
      this.context.fillStyle = 'rgb( 245, 11, 11 )';
      this.explosionWidth += 20;
      this.explosionHeight += 20;
      width = this.explosionWidth;
      height = this.explosionHeight;
      shape = new Shape( this.context );
      shape.ellipse( this.x - this.width * 2, this.y, 2.5 * width, height );
    };

    /**
     * throwBanana: Lets render the players arm up when throwing
     */
    Gorilla.prototype.throwBanana = function ( time ) {
      if ( this.timer < 1 ) {
        this.animate = true;
        if ( this.playerNumber === 1 ) {
          this.directionRight = 'up';
          this.directionLeft = 'down';
        } else {
          this.directionRight = 'down';
          this.directionLeft = 'up';
        }
        this.timer++;
      } else {
        this.animate = false;
      }
      this.banana.createFrame( time, this.playerNumber );
    };

    /**
     * checkColission: See if player has been hit
     */
    Gorilla.prototype.checkColission = function ( x, y ) {
      if ( this.y <= y && x > this.x - this.width / 2 && x < this.x + this.width / 2 ) {
        this.dead = true;
        return true;
      }
      return false;
    };

    /**
     * animateWin: Lets animate
     */
    Gorilla.prototype.animateWin = function () {
      this.animations++;
    };

    return Gorilla;
});
