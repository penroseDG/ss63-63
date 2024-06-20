import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './post.css';
import Loading from '../loading.component';

interface Post {
    id: number;
    title: string;
    image: string;
    date: string;
    status: boolean;
}

export default function Post() {
    const [post, setPost] = useState<Post[]>([]);
    const [isLoad, setIsLoad] = useState<boolean>(false);
    const [inputSearch, setInputSearch] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [showModal, setShowModal] = useState<boolean>(false);
    const [currentArticle, setCurrentArticle] = useState<Post | null>(null);
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [newPost, setNewPost] = useState<{ title: string; image: string; date: string }>({
        title: "",
        image: "",
        date: "",
    });
    const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
    const [postToDelete, setPostToDelete] = useState<Post | null>(null);

    useEffect(() => {
        getPost();
    }, [inputSearch]);

    const getPost = () => {
        setIsLoad(true);
        axios.get(`http://localhost:8080/posts?title_like=${inputSearch}`)
            .then(response => {
                console.log('giá trị trả về ', response.data);
                setPost(response.data);
                setIsLoad(false);
            })
            .catch((error: any) => {
                console.error('Có lỗi xảy ra', error);
                setError("Failed to fetch posts");
                setIsLoad(false);
            });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputSearch(e.target.value);
    };

    const handleBlockClick = (article: Post) => {
        setCurrentArticle(article);
        setShowModal(true);
    };

    const handleCancelBlock = () => {
        setShowModal(false);
        setCurrentArticle(null);
    };

    const handleConfirmBlock = () => {
        if (!currentArticle) return;

        const newStatus = !currentArticle.status;

        axios
            .patch(`http://localhost:8080/posts/${currentArticle.id}`, {
                status: newStatus,
            })
            .then(() => {
                const updatedPosts = post.map((article) =>
                    article.id === currentArticle.id ? { ...article, status: newStatus } : article
                );
                setPost(updatedPosts);
                setShowModal(false);
                setCurrentArticle(null);
            })
            .catch((error) => console.error("Có lỗi xảy ra.", error));
    };

    const handleAddPostClick = () => {
        setShowAddForm(true);
    };

    const handleCloseAddForm = () => {
        setShowAddForm(false);
    };

    const handleResetForm = () => {
        setShowResetConfirm(true);
    };

    const confirmResetForm = () => {
        setNewPost({ title: "", image: "", date: "" });
        setShowResetConfirm(false);
    };

    const handlePublishPost = () => {
        setError("");

        if (!newPost.title || !newPost.image || !newPost.date) {
            setError("Tên bài viết, hình ảnh và ngày thêm không được để trống");
            return;
        }

        if (post.some((p) => p.title === newPost.title)) {
            setError("Tên bài viết không được phép trùng");
            return;
        }

        axios
            .post("http://localhost:8080/posts", {
                ...newPost,
                status: true,
            })
            .then((response) => {
                setPost([...post, response.data]);
                setShowAddForm(false);
                setNewPost({ title: "", image: "", date: "" });
            })
            .catch((error) => console.error("Có lỗi xảy ra.", error));
    };

    const handleDeleteClick = (article: Post) => {
        setPostToDelete(article);
        setShowDeleteConfirm(true);
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
        setPostToDelete(null);
    };

    const handleConfirmDelete = () => {
        if (!postToDelete) return;

        axios
            .delete(`http://localhost:8080/posts/${postToDelete.id}`)
            .then(() => {
                const updatedPosts = post.filter((article) => article.id !== postToDelete.id);
                setPost(updatedPosts);
                setShowDeleteConfirm(false);
                setPostToDelete(null);
            })
            .catch((error) => console.error("Có lỗi xảy ra.", error));
    };

    return (
        <div>
            <h1>Post</h1>
            <div className="container">
                <div className="header">
                    <input type="text" placeholder="Nhập từ khóa tìm kiếm" value={inputSearch} onChange={handleSearchChange} />
                    <select name="" id="">
                        <option value="">Lọc bài viết</option>
                    </select>
                    <button className="add-new" onClick={handleAddPostClick}>Thêm mới bài viết</button>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tiêu đề</th>
                                <th>Hình ảnh</th>
                                <th>Ngày viết</th>
                                <th>Trạng thái</th>
                                <th>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoad ? (
                                <tr>
                                    <td colSpan={6}>Loading...</td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={6}>{error}</td>
                                </tr>
                            ) : (
                                post.map((post, index) => (
                                    <tr key={post.id}>
                                        <td>{index + 1}</td>
                                        <td>{post.title}</td>
                                        <td>
                                            <img src={post.image} alt={post.title} />
                                        </td>
                                        <td>{post.date}</td>
                                        <td>
                                            {post.status ? (
                                                <button>
                                                    đã xuất bản
                                                </button>
                                            ) : (
                                                <button>
                                                    ngừng xuất bản
                                                </button>
                                            )}
                                        </td>
                                        <td>
                                            <button className="block" onClick={() => handleBlockClick(post)}>Chặn</button>
                                            <button className="edit">Sửa</button>
                                            <button className="delete" onClick={() => handleDeleteClick(post)}>Xóa</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Xác nhận</h2>
                        <p>
                            Bạn có chắc chắn muốn {currentArticle?.status ? "ngừng xuất bản bài viết này?" : "xuất bản bài viết này?"}
                        </p>
                        <button className="btn btn-primary mb-2" onClick={handleCancelBlock}>Hủy</button>
                        <button className="btn btn-danger" onClick={handleConfirmBlock}>Xác nhận</button>
                    </div>
                </div>
            )}

            {showAddForm && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close-icon" onClick={handleCloseAddForm}>&times;</button>
                        <h2>Thêm mới bài viết</h2>
                        <label>
                            Tên bài viết:
                            <input
                                type="text"
                                value={newPost.title}
                                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                            />
                        </label>
                        <label>
                            Hình ảnh:
                            <input
                                type="text"
                                value={newPost.image}
                                onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
                            />
                        </label>
                        <label>
                            Ngày thêm:
                            <input
                                type="date"
                                value={newPost.date}
                                onChange={(e) => setNewPost({ ...newPost, date: e.target.value })}
                            />
                        </label>
                        {error && <p className="error">{error}</p>}
                        <button className="btn btn-danger" onClick={handleResetForm}>Reset</button>
                        <button className="btn btn-primary" onClick={handlePublishPost}>Xuất bản</button>
                    </div>
                </div>
            )}

            {showResetConfirm && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Xác nhận</h2>
                        <p>Bạn có chắc chắn muốn reset lại form?</p>
                        <button className="btn btn-primary mb-2" onClick={() => setShowResetConfirm(false)}>Hủy</button>
                        <button className="btn btn-danger" onClick={confirmResetForm}>Reset</button>
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Xác nhận</h2>
                        <p>Bạn có chắc chắn muốn xóa bài viết này?</p>
                        <button className="btn btn-primary mb-2" onClick={handleCancelDelete}>Hủy</button>
                        <button className="btn btn-danger" onClick={handleConfirmDelete}>Xác nhận</button>
                    </div>
                </div>
            )}
        </div>
    );
}
