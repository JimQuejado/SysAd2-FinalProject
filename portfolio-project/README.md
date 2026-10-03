# SysAd 2 Group Portfolio: Docker + Ansible

A static portfolio for a 4-member group, packaged as a Docker image and deployed
with Ansible to **1 CentOS VM** and **2 Ubuntu VMs**.

| # | Required deliverable | File(s) |
|---|---|---|
| 1 | Web app | `app/` (home page + `member-1.html` … `member-4.html`) |
| 2 | Dockerfile | `Dockerfile` (+ `docker/default.conf.template`) |
| 3 | Playbook that builds the image | `ansible/build_image.yml` (+ `roles/docker`) |
| 4 | Playbook that runs the containers | `ansible/run_containers.yml` |

```
portfolio-project/
├── app/                        # 1. the static web app
│   ├── index.html              #    home page: 4 member cards
│   ├── member-1.html … -4.html #    one page per member
│   ├── js/data.js              #    <-- EDIT: names, HOAs, exams, reflections
│   ├── js/common.js, home.js, member.js
│   ├── css/style.css
│   └── files/member-N/         #    put each member's PDFs/screenshots here
├── Dockerfile                  # 2. image definition (nginx:alpine)
├── docker/default.conf.template#    nginx config (adds /server-info and /healthz)
└── ansible/
    ├── ansible.cfg
    ├── inventory.ini           #    <-- EDIT: your VM IPs and user
    ├── requirements.yml        #    collections: community.docker, ansible.posix, community.general
    ├── group_vars/webservers.yml   # image name/tag, ports, build dir
    ├── roles/docker/           #    installs Docker (separate CentOS / Ubuntu task files)
    ├── build_image.yml         # 3. install Docker + build the image on each VM
    ├── run_containers.yml      # 4. run the image as containers + open firewall + health check
    └── site.yml                #    runs 3 then 4
```

---

## Part A. Prepare the lab

This guide starts from the lab you already have:

| Role | Inventory name | OS | Example IP |
|---|---|---|---|
| Control node (has Ansible) | `control-node` | Ubuntu | 192.168.56.100 |
| Managed node | `ubuntu-node` | Ubuntu | 192.168.56.102 |
| Managed node | `centos-node` | CentOS Stream 9 | 192.168.56.101 |

The control node is **also** deployed to (with `ansible_connection=local`, no SSH to itself), so the site runs on 1 CentOS VM and 2 Ubuntu VMs as the task requires. All commands below run on the control node.

### Step 1. Note each VM's IP

On each VM run `hostname` and `ip -4 addr`, and write down the host-only/bridged IP. Make sure the VMs can reach the internet (Docker and `nginx:alpine` are downloaded) and each other.

### Step 2. Get the project onto the control node

```bash
git clone https://github.com/<you>/<repo>.git portfolio-project   # or copy the folder
cd portfolio-project/ansible
ansible --version
ansible-galaxy collection install -r requirements.yml
```

### Step 3. Passwordless SSH from the control node to the 2 managed nodes

```bash
ssh-keygen -t ed25519            # skip if ~/.ssh/id_ed25519 already exists
ssh-copy-id student@192.168.56.101
ssh-copy-id student@192.168.56.102
ssh student@192.168.56.101 hostname   # no password prompt
```

### Step 4. Fill in the inventory and test the connection

Edit `ansible/inventory.ini`: replace the IPs, and `student` if your user differs. Then:

```bash
ansible-inventory --graph            # webservers -> centos (centos-node), ubuntu (ubuntu-node, control-node)
ansible webservers -m ping           # all three answer "pong"
ansible webservers -m setup -a "filter=ansible_os_family"   # RedHat vs Debian
```

📸 **Screenshot 1:** `ansible-inventory --graph` and the green `pong` from all 3 hosts.

---

## Part B. Fill in the web app

### Step 5. Put in your group's content

Open `app/js/data.js`. Everything is in one place:

- `GROUP`: group name, section.
- `MEMBERS`: four entries. For each member set `name`, `role`, `bio`, `skills`, optional `photo`, `links.github`.
- `items`: the seven required entries for each member: `prelimHoa`, `midtermHoa`, `finalsHoa`, `prelimExam`, `midtermExam`, `finalExam`, `reflection`.
  - `summary`: what you did. Anything starting with `TODO` counts as "not filled in" for the progress bar on the home page.
  - `image`: a screenshot shown on the card, e.g. `"files/member-1/prelim-hoa.png"`.
  - `file`: a "View output" button, e.g. a PDF in `files/member-1/` or a Google Drive / GitHub link.
  - `reflection.learnings`: a list of bullet points.

**Prelim HOA has 5 activities.** Instead of one `summary`, `prelimHoa` holds an `activities` list (HOA 1 to HOA 5). Each activity has a `title` (rename freely, e.g. `"HOA 1.1"`), `date`, `summary` and `pdf`. HOA 4 and 5 also have a `yaml` field for the playbook; HOA 1 to 3 are PDF only, so they have no `yaml` field. The member page shows a PDF button for each, and for HOA 4 and 5 a YAML button that displays the playbook right on the page. Prelim HOA counts as done on the progress bar once every PDF and YAML is filled in. Midterm or Finals HOA can use the same `activities` list if they also have several activities.

Put each member's files in `app/files/member-N/`, for example:

```
app/files/member-1/prelim/hoa-1.pdf      # HOA 1-3: PDF only
app/files/member-1/prelim/hoa-4.pdf      # HOA 4-5: PDF + YAML
app/files/member-1/prelim/hoa-4.yml
```

Preview without Docker by opening `app/index.html` in a browser, or run `python3 -m http.server -d app 8000` on the control node and visit http://192.168.56.100:8000 from your PC.

---

## Part C. Build the image with Ansible (deliverable 3)

### Step 6. Run the build playbook

```bash
cd ansible
ansible-playbook build_image.yml -K      # -K asks for the sudo password; omit it if sudo is passwordless
```

What it does on **each** VM:

1. **Installs Docker** through the `docker` role. The role reads the gathered facts and includes `RedHat.yml` on CentOS (dnf, Docker's CentOS repo, removes Podman conflicts) or `Debian.yml` on Ubuntu (apt, Docker's GPG key and Ubuntu repo). Then it starts and enables the `docker` service and adds your user to the `docker` group.
2. **Copies** the `Dockerfile`, `docker/` and `app/` to `/opt/portfolio/build`.
3. **Builds** `sysad2-portfolio:1.0` with `community.docker.docker_image`, and tags it `latest`.
4. **Prints** the image ID, size and creation time.

Verify:

```bash
ansible webservers -b -a "docker images sysad2-portfolio"
```

📸 **Screenshot 2:** the playbook run with the PLAY RECAP showing `failed=0` for all 3 hosts.
📸 **Screenshot 3:** the "Show the image that was built" output and `docker images` from each host.
📸 **Optional:** run it a second time with `--skip-tags install`. The recap shows `changed=0`, proving the playbook is idempotent (it only rebuilds when the app files change).

---

## Part D. Run the containers with Ansible (deliverable 4)

### Step 7. Run the run playbook

```bash
ansible-playbook run_containers.yml -K
```

What it does on **each** VM:

1. Checks the image exists (fails clearly if you skipped Step 6).
2. Starts container `portfolio-web` from `sysad2-portfolio:1.0` with `community.docker.docker_container`: port `80 → 80`, restart policy `unless-stopped`, environment variables `SERVED_BY` (host name + OS) and `CONTAINER_NAME`, and labels.
3. Opens port 80 in **firewalld** on CentOS or **ufw** on Ubuntu (only if that firewall is active).
4. Waits until `http://127.0.0.1/healthz` answers 200.
5. Prints the URL to open.

Verify:

```bash
ansible webservers -b -a "docker ps --filter label=project=sysad2-portfolio"
```

The STATUS column should say `Up … (healthy)` thanks to the `HEALTHCHECK` in the Dockerfile.

📸 **Screenshot 4:** the playbook run and PLAY RECAP.
📸 **Screenshot 5:** `docker ps` on all 3 hosts showing the container `(healthy)`.

### Step 8. Open the site in a browser

Visit each VM:

- http://192.168.56.101/ (centos-node)
- http://192.168.56.102/ (ubuntu-node)
- http://192.168.56.100/ (control-node)

The footer says **"Served by centos-node (CentOS 9) · container portfolio-web"**, so each screenshot proves which VM served it.

📸 **Screenshot 6:** the home page on each of the 3 VMs with the footer visible.
📸 **Screenshot 7:** one member page (e.g. `member-1.html`) showing the 7 items.

Shortcut: `ansible-playbook site.yml -K` runs Step 6 and Step 7 together.

---

## Part E. Updating and extras

**Change content and redeploy.** Edit `app/js/data.js` (or add files), then bump `image_tag` in `group_vars/webservers.yml` (e.g. `"1.1"`) and run `ansible-playbook site.yml -K`. The new image is built and the containers are recreated on it. Without a tag bump it still works: the copy tasks detect changed files and force a rebuild, and `docker_container` recreates the container when the image changes.

**More containers per VM.** Add entries to `portfolio_containers` in `group_vars/webservers.yml`:

```yaml
portfolio_containers:
  - name: portfolio-web
    host_port: 80
  - name: portfolio-web-2
    host_port: 8080
```

The run playbook loops over the list, opens each port, and health-checks each container.

**Run only part of it.** `ansible-playbook build_image.yml --skip-tags install` skips the Docker install (useful on reruns).

**Check before you change.** After the first deploy, `ansible-playbook site.yml --check --diff` previews what a rerun would change. `ansible-playbook site.yml --syntax-check` validates syntax.

---

## How Ansible and Docker are used (talking points for grading)

**Ansible**
- **Inventory groups**: `centos`, `ubuntu`, and parent group `webservers`, so one playbook targets all 3 VMs.
- **group_vars**: image name, tag, ports and paths live in one file instead of being hard-coded.
- **Role** (`roles/docker`) with **defaults** for the package list.
- **Facts + conditional includes**: `include_tasks: "{{ ansible_os_family }}.yml"` picks dnf/CentOS or apt/Ubuntu steps automatically; firewall tasks use `when:` on the OS family and service state.
- **Modules instead of shell**: `dnf`, `apt`, `apt_repository`, `get_url`, `systemd_service`, `user`, `copy`, `firewalld`, `ufw`, `uri`, `service_facts`, and the `community.docker` modules `docker_image`, `docker_image_tag`, `docker_image_info`, `docker_container`, `docker_host_info`.
- **Loops** with `loop_control.label`, **register** + **until/retries** for health checks, `failed_when` for a clear pre-check error.
- **Idempotency**: a second run (`--skip-tags install`) reports `changed=0`; the image rebuilds only when copied files changed.
- **Tags** (`install`) and `import_playbook` in `site.yml`.
- Passes `ansible-lint` with the strictest (`production`) profile.

**Docker**
- Small official base image `nginx:1.27-alpine` (final image about 20 MB), version pinned.
- Removes the default site and config, copies the app and an nginx **template**.
- `ENV` defaults overridden at run time with `-e` (Ansible `env:`), which nginx's entrypoint substitutes into the config. That is what makes `/server-info` show each host's name.
- `EXPOSE 80`, `HEALTHCHECK` on `/healthz`, OCI `LABEL`s, `.dockerignore` to keep the build context small.
- Containers run with port publishing, a restart policy and labels used for filtering.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `Permission denied (publickey)` | Redo Step 3 for that IP; check `ansible_user` in the inventory. |
| `Missing sudo password` | Add `-K` to the command. |
| CentOS: `Error: Unable to find a match` / conflicts with podman | Make sure it is CentOS Stream 9; the role already removes `podman-docker`, `buildah`, `runc` and uses `allowerasing`. |
| Port 80 already in use | Another web server is running (`sudo systemctl disable --now httpd` or `apache2`), or change `host_port`. |
| Browser can't reach the VM but `curl localhost` on the VM works | Firewall or wrong adapter. Use the host-only/bridged IP; check `sudo firewall-cmd --list-ports` (CentOS) or `sudo ufw status` (Ubuntu). |
| `toomanyrequests` while building | Docker Hub rate limit for anonymous pulls. Wait and rerun, or `docker login` on the VM. |
| `docker: permission denied` as your user | Log out and back in once so the new `docker` group applies, or use `sudo`. |
| `couldn't resolve module/action 'community.docker.docker_image'` | Run `ansible-galaxy collection install -r requirements.yml` on the controller. |

---

## Putting it on GitHub

```bash
cd portfolio-project
git init && git add . && git commit -m "SysAd 2 portfolio: web app, Dockerfile, Ansible playbooks"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Optional: the `app/` folder is plain static files, so it can also be published with GitHub Pages (deploy the `app` folder). The footer will then say "static hosting (no Docker)".
