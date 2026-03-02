{ pkgs, ... }: {
  channel = "stable-23.11";
  packages = [
    pkgs.nodejs_20
  ];
  idx = {
    # 미리보기(web 탭) 설정
    previews = {
      enable = true;
      previews = {
        web = {
          # npx를 이용해 http-server를 실행합니다.
          command = [ "npx" "http-server" "-p" "$PORT" "-c-1" ];
          manager = "web";
        };
      };
    };
  };
}