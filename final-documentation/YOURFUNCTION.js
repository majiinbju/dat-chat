       
      window.onload = function() {
        // doc elements
        var peersNum = document.getElementById("peersNum");
        var peersList = document.getElementById("peersList");

        // dat vars for your personal page (automatically generated)
        // var url = "dat://"
        var url = window.location.toString(),
          archive = new DatArchive(url);

        // we want an async function to start listening for peers:
        var getPeers = async function(archive) {
          console.log("in async: ", archive);
          var peers = await experimental.datPeers.list();
          return peers;
        };

        getPeers(archive).then(result => {
          updateUI(result);
        });

        // Update the ui when data changes
        function updateUI(result) {
          var peersListText = ``;

          result.forEach(peerData => {
            console.log(peerData.id);
            var peer = `<li>${peerData.id + " " + peerData.sessionData}</li>`;
            peersListText = peersListText + peer;
          });

          console.log("then: ", result);
          peersNum.innerHTML = `${result.length} `;
          peersList.innerHTML = peersListText;
        }

        // when a peer comes online
        experimental.datPeers.addEventListener("connect", ({ peer }) => {
          console.log(peer.id, "has connected");
          // getPeers(archive).then(result => {
          //   updateUI(result);
          // });
        });

        // when a peer goes offline
        experimental.datPeers.addEventListener("disconnect", ({ peer }) => {
          console.log(peer.id, "has disconnected");
          // getPeers(archive).then(result => {
          //   updateUI(result);
          // });
        });
        
        experimental.datPeers.addEventListener('message', ({peer, message}) => {
          console.log(peer.id, 'has sent the following message:', message)
          updateMessagesUI(message)
        })
        
        experimental.datPeers.addEventListener('session-data', ({peer}) => {
          console.log(peer.id, 'has set their session data to', peer.sessionData)
        })

        /******************************************************************************/
        // a message a peer broadcasts
        experimental.datPeers.broadcast({
          name: "anything",
          content: window.location.toString()
        });
        
      };