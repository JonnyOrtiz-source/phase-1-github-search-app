'use strict';

(function () {
   // VARIABLES
   const BASE_URL = 'https://api.github.com';

   // DOM ELEMENTS
   const frmSearch = document.getElementById('github-form');
   const userList = document.getElementById('user-list');
   const reposList = document.getElementById('repos-list');

   // FUNCTIONS
   const renderRepo = (repoObj) => {
      const liRepo = document.createElement('li');
      const linkRepo = document.createElement('a');
      linkRepo.href = repoObj.html_url;
      linkRepo.target = '_blank';
      linkRepo.textContent = repoObj.full_name.split('/').pop();
      linkRepo.id = repoObj.full_name;
      liRepo.appendChild(linkRepo);
      reposList.append(liRepo);
   };

   const renderUser = (repoObj) => {
      const liUserRepo = document.createElement('li');
      const linkUserRepo = document.createElement('a');
      linkUserRepo.href = '#';
      linkUserRepo.textContent = repoObj.html_url.split('/').pop();
      linkUserRepo.id = repoObj.login;
      liUserRepo.appendChild(linkUserRepo);
      userList.append(liUserRepo);
   };

   const getUserRepo = async (repoLink) => {
      try {
         const r = await fetch(`${BASE_URL}/users/${repoLink.id}/repos`);
         if (r.ok) {
            const repos = await r.json();
            reposList.innerHTML = '';
            repos.forEach((repoObj) => {
               renderRepo(repoObj);
            });
         } else {
            throw new Error(`Problem: ${r.status}, ${r.statusText}`);
         }
      } catch (err) {
         alert(err);
      }
   };

   const getUsers = async (userName) => {
      try {
         const myHeaders = new Headers();
         myHeaders.append('Accept', 'application/vnd.github.v3+json');
         const requestOptions = {
            method: 'GET',
            headers: myHeaders,
         };
         const r = await fetch(
            `${BASE_URL}/search/users?q=${userName}`,
            requestOptions
         );
         if (r.ok) {
            const { items } = await r.json();
            userList.innerHTML = '';
            items.forEach((repoObj) => renderUser(repoObj));
         } else {
            throw new Error(`Problem: ${r.status}, ${r.statusText}`);
         }
      } catch (err) {
         alert(err);
      }
   };

   // HANDLERS
   const handleUserSearch = (e) => {
      const userName = frmSearch.search.value;
      getUsers(userName);
   };

   const handleRepoSearch = (e) => {
      const repoLink = document.getElementById(`${e.target.id}`);
      getUserRepo(repoLink);
   };

   // EVENTS
   frmSearch.addEventListener('submit', (e) => {
      e.preventDefault();
      handleUserSearch(e);
      frmSearch.reset();
   });

   userList.addEventListener('click', (e) => {
      e.stopPropagation();
      handleRepoSearch(e);
   });
})();
