export type Client = {
    client_ip: string;
    upstream_server: string;
    upstream_path: string;
    name: string;
    detailed_name: string;
    x_position: number;
    y_position: number;
};

export type Config = {
    ip_addr_internal: string;
    ip_addr_external: string;

    mediamtx_port: number;
    internal_api_port: number;
    external_api_port: number;
    forward_port: number;
    results_port: number;
    client_api_port: number;
    lookup_ports_start: number;

    enable_cam_quick_view: number;
    enable_desktop_quick_view: number;

    forward_job: string;
    lookup_job: string;

    client_ffmpeg_destkop_options: string;
    client_ffmpeg_destkop_qv_options: string;
    client_ffmpeg_cam_options: string;
    client_ffmpeg_cam_qv_options: string;
    clients: Client[];
};
